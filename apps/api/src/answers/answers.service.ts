import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import {
  answers,
  questionStats,
  questions,
  users,
  type Database,
} from '@workspace/db';
import type { AnswerType } from '@workspace/validations/answer';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import type { RequestUser } from '../common/session/user.js';
import {
  beforeCursor,
  decodeCursor,
  encodeCursor,
  selectCursorTimestamp,
} from '../lib/cursor.js';
import { sanitizeRichText } from '../lib/sanitize-rich-text.js';
import { adjustUserStats } from '../users/adjust-user-stats.js';

@Injectable()
export class AnswersService {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async listByQuestionSlug(slug: string, limit = 50, cursor?: string) {
    const filters = [eq(questions.slug, slug)];
    if (cursor) {
      filters.push(
        beforeCursor(answers.updatedAt, answers.id, decodeCursor(cursor)),
      );
    }

    const rows = await this.db
      .select({
        id: answers.id,
        description: answers.description,
        authorId: answers.authorId,
        questionId: answers.questionId,
        createdAt: answers.createdAt,
        updatedAt: answers.updatedAt,
        cursorUpdatedAt: selectCursorTimestamp(answers.updatedAt),
        author: {
          name: users.name,
          profilePicture: users.profilePicture,
        },
      })
      .from(answers)
      .innerJoin(questions, eq(answers.questionId, questions.id))
      .innerJoin(users, eq(answers.authorId, users.id))
      .where(and(...filters))
      .orderBy(desc(answers.updatedAt), desc(answers.id))
      .limit(limit + 1);

    const hasNext = rows.length > limit;
    const page = hasNext ? rows.slice(0, limit) : rows;
    const last = page.at(-1);

    return {
      data: page.map(
        ({ cursorUpdatedAt: _cursorUpdatedAt, ...answer }) => answer,
      ),
      pagination: {
        nextCursor:
          hasNext && last
            ? encodeCursor({
                updatedAt: last.cursorUpdatedAt,
                id: last.id,
              })
            : null,
      },
    };
  }

  async create(user: RequestUser, slug: string, answerData: AnswerType) {
    const description = sanitizeRichText(answerData.description || '');
    if (!description.trim())
      throw new BadRequestException('Answer cannot be empty');

    return this.db.transaction(async (tx) => {
      // Bump the counter first: resolves slug → question, proves it exists,
      // and returns the id, all in one statement
      const [stats] = await tx
        .update(questionStats)
        .set({ answersCount: sql`${questionStats.answersCount} + 1` })
        .where(
          inArray(
            questionStats.questionId,
            tx
              .select({ id: questions.id })
              .from(questions)
              .where(eq(questions.slug, slug)),
          ),
        )
        .returning({ questionId: questionStats.questionId });

      if (!stats) throw new NotFoundException('Question not found'); // rolls back

      const [answer] = await tx
        .insert(answers)
        .values({
          description,
          authorId: user.id,
          questionId: stats.questionId,
        })
        .returning({ id: answers.id });

      await adjustUserStats(tx, [{ userId: user.id, answerDelta: 1 }]);
      return answer;
    });
  }

  async update(user: RequestUser, id: string, answerData: AnswerType) {
    const description = sanitizeRichText(answerData.description || '');
    if (!description.trim())
      throw new BadRequestException('Answer cannot be empty');

    const [updated] = await this.db
      .update(answers)
      .set({ description })
      .where(and(eq(answers.id, id), eq(answers.authorId, user.id)))
      .returning({ id: answers.id });

    if (!updated) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'ANSWER_NOT_FOUND_OR_FORBIDDEN',
        message: 'Answer not found or you do not have permission to edit it',
      });
    }
  }

  async remove(user: RequestUser, id: string) {
    await this.db.transaction(async (tx) => {
      const [removed] = await tx
        .delete(answers)
        .where(and(eq(answers.id, id), eq(answers.authorId, user.id)))
        .returning({ questionId: answers.questionId });

      if (!removed)
        throw new NotFoundException({
          statusCode: 404,
          error: 'ANSWER_NOT_FOUND_OR_FORBIDDEN',
          message:
            'Answer not found or you do not have permission to delete it',
        });

      await tx
        .update(questionStats)
        .set({ answersCount: sql`${questionStats.answersCount} - 1` })
        .where(eq(questionStats.questionId, removed.questionId));
      await adjustUserStats(tx, [{ userId: user.id, answerDelta: -1 }]);
    });
  }
}

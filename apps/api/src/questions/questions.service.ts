import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import {
  answers,
  questionStats,
  questionVotes,
  questions,
  users,
  type Database,
} from '@workspace/db';
import type {
  DeleteQuestionType,
  EditQuestionType,
  QuestionType,
} from '@workspace/validations/question';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import type { RequestUser } from '../common/session/user.js';
import { createSlug } from '../lib/create-slug.js';
import {
  beforeCursor,
  decodeCursor,
  encodeCursor,
  selectCursorTimestamp,
} from '../lib/cursor.js';
import { sanitizeRichText } from '../lib/sanitize-rich-text.js';
import { adjustUserStats } from '../users/adjust-user-stats.js';

export type VoteType = 'like' | 'dislike' | 'remove';

function voteDelta(previous: number | null, next: number | null) {
  return {
    likes: (next === 1 ? 1 : 0) - (previous === 1 ? 1 : 0),
    dislikes: (next === -1 ? 1 : 0) - (previous === -1 ? 1 : 0),
  };
}
const userVoteOf = (userId?: string | null) =>
  userId
    ? sql<number | null>`(
        SELECT ${questionVotes.vote} FROM ${questionVotes}
        WHERE ${questionVotes.questionId} = ${questions.id}
          AND ${questionVotes.userId} = ${userId}
      )`
    : sql<null>`NULL`;

const escapeLike = (s: string) => s.replace(/[\\%_]/g, '\\$&');
const questionColumns = {
  id: questions.id,
  title: questions.title,
  description: questions.description,
  author: { name: users.name, profilePicture: users.profilePicture },
  authorId: questions.authorId,
  createdAt: questions.createdAt,
  slug: questions.slug,
};
@Injectable()
export class QuestionsService {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async list(
    keyword: string,
    limit: number,
    cursor: string | undefined,
    userId?: string | null,
  ) {
    const filters = [];
    if (keyword) {
      const pattern = `%${escapeLike(keyword)}%`;
      filters.push(
        or(
          ilike(questions.title, pattern),
          ilike(questions.description, pattern),
        )!,
      );
    }
    if (cursor) {
      filters.push(
        beforeCursor(questions.updatedAt, questions.id, decodeCursor(cursor)),
      );
    }

    const rows = await this.db
      .select({
        ...questionColumns,
        updatedAt: selectCursorTimestamp(questions.updatedAt),
        answersCount: questionStats.answersCount,
        likes: questionStats.likes,
        dislikes: questionStats.dislikes,
        userVote: userVoteOf(userId),
      })
      .from(questions)
      .innerJoin(users, eq(questions.authorId, users.id))
      .innerJoin(questionStats, eq(questions.id, questionStats.questionId))
      .where(and(...filters))
      .orderBy(desc(questions.updatedAt), desc(questions.id))
      .limit(limit + 1);

    const hasNext = rows.length > limit;
    const page = hasNext ? rows.slice(0, limit) : rows;
    const last = page.at(-1);

    return {
      data: page.map(({ updatedAt: _updatedAt, ...question }) => question),
      pagination: {
        nextCursor: hasNext && last ? encodeCursor(last) : null,
      },
    };
  }

  async allSlugs() {
    return this.db
      .select({
        id: questions.id,
        slug: questions.slug,
      })
      .from(questions)
      .orderBy(desc(questions.updatedAt));
  }

  async create(user: RequestUser, questionData: QuestionType) {
    const slug = createSlug(questionData.title);
    await this.db.transaction(async (tx) => {
      const [q] = await tx
        .insert(questions)
        .values({
          title: questionData.title,
          description: sanitizeRichText(questionData.description || ''),
          authorId: user.id,
          slug,
        })
        .returning({ id: questions.id });
      await tx.insert(questionStats).values({ questionId: q.id });
      await adjustUserStats(tx, [{ userId: user.id, questionDelta: 1 }]);
    });
    return { slug };
  }

  async bySlug(slug: string, userId?: string | null) {
    const [question] = await this.db
      .select({
        ...questionColumns,
        answersCount: questionStats.answersCount,
        likes: questionStats.likes,
        dislikes: questionStats.dislikes,
        userVote: userVoteOf(userId),
      })
      .from(questions)
      .innerJoin(users, eq(questions.authorId, users.id))
      .innerJoin(questionStats, eq(questions.id, questionStats.questionId))
      .where(eq(questions.slug, slug))
      .limit(1);

    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async contentBySlug(slug: string) {
    const [question] = await this.db
      .select(questionColumns)
      .from(questions)
      .innerJoin(users, eq(questions.authorId, users.id))
      .where(eq(questions.slug, slug))
      .limit(1);

    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async statsBySlug(slug: string, userId?: string | null) {
    const [stats] = await this.db
      .select({
        id: questions.id,
        answersCount: questionStats.answersCount,
        likes: questionStats.likes,
        dislikes: questionStats.dislikes,
        userVote: userVoteOf(userId),
      })
      .from(questions)
      .innerJoin(questionStats, eq(questions.id, questionStats.questionId))
      .where(eq(questions.slug, slug))
      .limit(1);

    if (!stats) {
      throw new NotFoundException('Question not found');
    }
    return stats;
  }

  async update(user: RequestUser, questionData: EditQuestionType) {
    const [updated] = await this.db
      .update(questions)
      .set({
        title: questionData.title,
        description: sanitizeRichText(questionData.description || ''),
      })
      .where(
        and(eq(questions.id, questionData.id), eq(questions.authorId, user.id)),
      )
      .returning({ slug: questions.slug });

    if (!updated) {
      throw new NotFoundException({
        statusCode: 404,
        error: 'QUESTION_NOT_FOUND_OR_FORBIDDEN',
        message: 'Question not found or you do not have permission to edit it',
      });
    }

    return { slug: updated.slug };
  }

  async remove(user: RequestUser, questionData: DeleteQuestionType) {
    const questionId = questionData.id;

    return this.db.transaction(async (tx) => {
      const forbidden = {
        statusCode: 404,
        error: 'QUESTION_NOT_FOUND_OR_FORBIDDEN',
        message:
          'Question not found or you do not have permission to delete it',
      };

      // Lock the question before reading answers so an insert waits on this row.
      const [locked] = await tx
        .select({ id: questions.id })
        .from(questions)
        .where(
          and(eq(questions.id, questionId), eq(questions.authorId, user.id)),
        )
        .for('update');

      if (!locked) throw new NotFoundException(forbidden);

      // Lock the answer rows so a concurrent delete cannot change this set.
      const answerAuthors = await tx
        .select({ authorId: answers.authorId })
        .from(answers)
        .where(eq(answers.questionId, questionId))
        .for('update');

      // Delete the question. The WHERE enforces ownership.
      // The cascade removes the answers (and the stats row, if it cascades too).
      const [removed] = await tx
        .delete(questions)
        .where(
          and(eq(questions.id, questionId), eq(questions.authorId, user.id)),
        )
        .returning({ slug: questions.slug });

      if (!removed) throw new NotFoundException(forbidden);

      // adjustUserStats merges duplicates and sorts, so just pass raw entries.
      await adjustUserStats(tx, [
        { userId: user.id, questionDelta: -1 },
        ...answerAuthors.map(({ authorId }) => ({
          userId: authorId,
          answerDelta: -1,
        })),
      ]);

      return { slug: removed.slug };
    });
  }

  async vote(user: RequestUser, questionId: string, voteType: VoteType) {
    const next = voteType === 'like' ? 1 : voteType === 'dislike' ? -1 : null;
    const voteWhere = and(
      eq(questionVotes.questionId, questionId),
      eq(questionVotes.userId, user.id),
    );

    return this.db.transaction(async (tx) => {
      // 1. Lock the stats row first: existence check + per-question serialization
      const [stats] = await tx
        .select({
          likes: questionStats.likes,
          dislikes: questionStats.dislikes,
        })
        .from(questionStats)
        .where(eq(questionStats.questionId, questionId))
        .for('update');

      if (!stats) throw new NotFoundException('Question not found'); // rolls back

      // 2. Read the user's current vote (safe: we hold the lock)
      const [existing] = await tx
        .select({ vote: questionVotes.vote })
        .from(questionVotes)
        .where(voteWhere);

      const previous = existing?.vote ?? null;
      const { likes, dislikes } = voteDelta(previous, next);

      // 3. No change: return current counts, skip writes
      if (likes === 0 && dislikes === 0) {
        return { ...stats, userVote: next };
      }

      // 4. Write the vote
      if (next === null) {
        await tx.delete(questionVotes).where(voteWhere);
      } else if (previous === null) {
        await tx
          .insert(questionVotes)
          .values({ questionId, userId: user.id, vote: next });
      } else {
        await tx.update(questionVotes).set({ vote: next }).where(voteWhere);
      }

      // 5. Update counters and return the new values
      const [updated] = await tx
        .update(questionStats)
        .set({
          likes: sql`${questionStats.likes} + ${likes}`,
          dislikes: sql`${questionStats.dislikes} + ${dislikes}`,
        })
        .where(eq(questionStats.questionId, questionId))
        .returning({
          likes: questionStats.likes,
          dislikes: questionStats.dislikes,
        });

      return { ...updated, userVote: next };
    });
  }
}

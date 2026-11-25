import { userStats, type Database } from '@workspace/db';
import { eq, sql } from 'drizzle-orm';

type UserStatsTx = Parameters<Parameters<Database['transaction']>[0]>[0];

type UserStatsDelta = {
  userId: string;
  questionDelta?: number;
  answerDelta?: number;
};

export async function adjustUserStats(
  tx: UserStatsTx,
  deltas: UserStatsDelta[],
): Promise<void> {
  const merged = new Map<
    string,
    { questionDelta: number; answerDelta: number }
  >();

  for (const delta of deltas) {
    const current = merged.get(delta.userId) ?? {
      questionDelta: 0,
      answerDelta: 0,
    };
    current.questionDelta += delta.questionDelta ?? 0;
    current.answerDelta += delta.answerDelta ?? 0;
    merged.set(delta.userId, current);
  }

  const userIds = [...merged.keys()]
    .filter((userId) => {
      const delta = merged.get(userId)!;
      return delta.questionDelta !== 0 || delta.answerDelta !== 0;
    })
    .sort();

  for (const userId of userIds) {
    const delta = merged.get(userId)!;
    const updated = await tx
      .update(userStats)
      .set({
        questionCount: sql`${userStats.questionCount} + ${delta.questionDelta}`,
        answerCount: sql`${userStats.answerCount} + ${delta.answerDelta}`,
      })
      .where(eq(userStats.userId, userId))
      .returning({ userId: userStats.userId });

    if (updated.length === 0) {
      throw new Error(`user_stats row missing for ${userId}`);
    }
  }
}

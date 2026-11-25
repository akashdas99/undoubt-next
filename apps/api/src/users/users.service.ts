import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { userStats, users, type Database } from '@workspace/db';
import { desc, eq, sql } from 'drizzle-orm';
import type { RequestUser } from '../common/session/user.js';

const publicUser = {
  id: users.id,
  name: users.name,
  userName: users.userName,
  profilePicture: users.profilePicture,
  createdAt: users.createdAt,
};

@Injectable()
export class UsersService {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  // Private: only for the logged-in user's own account
  async profile(user: RequestUser) {
    const [me] = await this.db
      .select({ ...publicUser, email: users.email, updatedAt: users.updatedAt })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!me) throw new NotFoundException('User not found');
    return me;
  }

  // Public: safe to expose on /users/:id
  async byId(userId: string) {
    const [user] = await this.db
      .select(publicUser)
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async topContributors(limit = 10) {
    const contribution = sql`${userStats.questionCount} + ${userStats.answerCount}`;

    return this.db
      .select({
        id: users.id,
        name: users.name,
        userName: users.userName,
        profilePicture: users.profilePicture,
        createdAt: users.createdAt,
        questionCount: userStats.questionCount,
        answerCount: userStats.answerCount,
      })
      .from(userStats)
      .innerJoin(users, eq(users.id, userStats.userId))
      .where(sql`${contribution} > 0`)
      .orderBy(desc(contribution))
      .limit(limit);
  }
}

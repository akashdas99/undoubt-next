import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Inject } from '@nestjs/common';

import { eq, or, users } from '@repo/db';

import type { createPoolDb } from '@repo/db/client';

import bcryptjs from 'bcryptjs';

import { nanoid } from 'nanoid';

import { DRIZZLE } from '../db/db.constants.js';

import { EmailService } from '../email/email/email.service.js';

import { TokensService, type AccessToken } from './tokens/tokens.service.js';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE) private readonly db: ReturnType<typeof createPoolDb>,

    private readonly tokens: TokensService,

    private readonly email: EmailService,
  ) {}

  async register(validatedUser: RegisterDto): Promise<AccessToken> {
    const [conflict] = await this.db

      .select({ email: users.email, userName: users.userName })

      .from(users)

      .where(
        or(
          eq(users.email, validatedUser.email),

          eq(users.userName, validatedUser.userName),
        ),
      )

      .limit(1);

    if (conflict) {
      if (conflict.email === validatedUser.email) {
        throw new ConflictException({
          errors: { email: { message: 'Email already exists' } },
        });
      }

      throw new ConflictException({
        errors: { userName: { message: 'UserName already exists' } },
      });
    }

    const hashedPassword = await bcryptjs.hash(validatedUser.password, 10);

    const [registeredUser] = await this.db

      .insert(users)

      .values({
        name: validatedUser.name,

        userName: validatedUser.userName,

        email: validatedUser.email,

        password: hashedPassword,
      })

      .returning({
        id: users.id,

        userName: users.userName,
      });

    if (!registeredUser) {
      throw new BadRequestException('Failed to create user');
    }

    return this.tokens.issueAccessToken(registeredUser);
  }

  async login(validatedUser: LoginDto): Promise<AccessToken> {
    const [user] = await this.db

      .select({
        id: users.id,

        userName: users.userName,

        password: users.password,
      })

      .from(users)

      .where(eq(users.email, validatedUser.email))

      .limit(1);

    if (!user) {
      throw new UnauthorizedException({
        errors: { email: { message: 'User not found' } },
      });
    }

    const isCorrectPassword = await bcryptjs.compare(
      validatedUser.password,

      user.password,
    );

    if (!isCorrectPassword) {
      throw new UnauthorizedException({
        errors: { password: { message: 'Incorrect Password' } },
      });
    }

    return this.tokens.issueAccessToken({
      id: user.id,

      userName: user.userName,
    });
  }

  async forgotPassword(body: ForgotPasswordDto): Promise<void> {
    const [user] = await this.db

      .select({ id: users.id, email: users.email })

      .from(users)

      .where(eq(users.email, body.email))

      .limit(1);

    if (!user) {
      return;
    }

    const resetToken = nanoid(32);

    const resetTokenExpiry = new Date(Date.now() + 300_000);

    await this.db

      .update(users)

      .set({ resetToken, resetTokenExpiry })

      .where(eq(users.id, user.id));

    const resetLink = `${process.env.NEXT_PUBLIC_BASEURL}/reset-password?token=${resetToken}`;

    await this.email.sendPasswordReset(user.email, resetLink);
  }

  async resetPassword(validatedData: ResetPasswordDto): Promise<void> {
    const [user] = await this.db

      .select({
        id: users.id,

        resetTokenExpiry: users.resetTokenExpiry,
      })

      .from(users)

      .where(eq(users.resetToken, validatedData.token))

      .limit(1);

    if (!user) {
      throw new BadRequestException({
        errors: { token: { message: 'Invalid or expired reset token' } },
      });
    }

    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestException({
        errors: { token: { message: 'Reset token has expired' } },
      });
    }

    const hashedPassword = await bcryptjs.hash(validatedData.password, 10);

    await this.db

      .update(users)

      .set({
        password: hashedPassword,

        resetToken: null,

        resetTokenExpiry: null,
      })

      .where(eq(users.id, user.id));
  }
}

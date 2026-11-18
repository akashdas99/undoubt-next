import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDrizzle } from '@nestjs/drizzle';
import { users, type Database } from '@workspace/db';
import bcryptjs from 'bcryptjs';
import { eq, or } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { createHash } from 'node:crypto';
import {
  duplicateFieldConflict,
  isUniqueViolation,
  uniqueViolationField,
} from '../common/db-error.js';
import { EmailService } from '../email/email/email.service.js';
import {
  INVALID_CREDENTIALS_MESSAGE,
  REGISTER_DUPLICATE_MESSAGE,
  REGISTER_UNIQUE_COLUMNS,
} from '@/lib/constants.js';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto.js';
import { TokensService, type AccessToken } from './tokens/tokens.service.js';

/** One-way digest stored in the DB; the raw token is only sent in the reset link. */
export function hashResetToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectDrizzle() private readonly db: Database,
    private readonly tokens: TokensService,
    private readonly email: EmailService,
    private readonly config: ConfigService,
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
        throw duplicateFieldConflict('email', REGISTER_DUPLICATE_MESSAGE.email);
      }

      throw duplicateFieldConflict(
        'userName',
        REGISTER_DUPLICATE_MESSAGE.userName,
      );
    }

    const hashedPassword = await bcryptjs.hash(validatedUser.password, 10);

    // Two parallel sign-ups can both pass the SELECT; turn insert 23505 into 409, not 500.
    try {
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
    } catch (error) {
      if (isUniqueViolation(error)) {
        const field =
          uniqueViolationField(error, REGISTER_UNIQUE_COLUMNS) ?? 'email';
        throw duplicateFieldConflict(
          field,
          REGISTER_DUPLICATE_MESSAGE[field] ?? REGISTER_DUPLICATE_MESSAGE.email,
        );
      }
      throw error; // connection errors, etc. — not a duplicate user
    }
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
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const isCorrectPassword = await bcryptjs.compare(
      validatedUser.password,
      user.password,
    );

    if (!isCorrectPassword) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
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

    // Always respond the same when the email is unknown (no enumeration).
    if (!user) {
      return;
    }

    const resetToken = nanoid(32);
    const resetTokenExpiry = new Date(Date.now() + 300_000);

    await this.db
      .update(users)
      .set({ resetToken: hashResetToken(resetToken), resetTokenExpiry })
      .where(eq(users.id, user.id));

    const webOrigin = this.config.getOrThrow<string>('WEB_ORIGIN');
    const resetLink = `${webOrigin}/reset-password?token=${resetToken}`;

    // Do not await: response time should not reveal that the account exists.
    void this.email.sendPasswordReset(user.email, resetLink).catch((err) => {
      this.logger.error('Failed to send password reset email', err);
    });
  }

  async resetPassword(validatedData: ResetPasswordDto): Promise<void> {
    const tokenHash = hashResetToken(validatedData.token); // matches value stored in forgotPassword

    const [user] = await this.db
      .select({
        id: users.id,
        resetTokenExpiry: users.resetTokenExpiry,
      })
      .from(users)
      .where(eq(users.resetToken, tokenHash))
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

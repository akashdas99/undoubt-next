import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getDrizzleToken } from '@nestjs/drizzle';
import { Test, TestingModule } from '@nestjs/testing';
import bcryptjs from 'bcryptjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BCRYPT_COST } from '@workspace/constants';
import { UNIQUE_VIOLATION } from '@/lib/constants.js';
import { EmailService } from '../email/email/email.service.js';
import { AuthService, hashResetToken } from './auth.service.js';
import { TokensService } from './tokens/tokens.service.js';

describe('hashResetToken', () => {
  it('returns a deterministic SHA-256 hex digest', () => {
    expect(hashResetToken('abc')).toBe(hashResetToken('abc'));
    expect(hashResetToken('abc')).toMatch(/^[a-f0-9]{64}$/);
    expect(hashResetToken('abc')).not.toBe('abc');
  });
});

describe('AuthService', () => {
  let service: AuthService;
  let tokens: { issueAccessToken: ReturnType<typeof vi.fn> };
  let email: { sendPasswordReset: ReturnType<typeof vi.fn> };
  let db: {
    select: ReturnType<typeof vi.fn>;
    insert: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };

  const config = {
    getOrThrow: vi.fn((key: string) => {
      if (key === 'WEB_ORIGIN') {
        return 'http://localhost:3000';
      }
      throw new Error(`${key} is not set`);
    }),
    get: vi.fn(),
  };

  beforeEach(async () => {
    tokens = {
      issueAccessToken: vi.fn().mockResolvedValue({ accessToken: 'jwt' }),
    };
    email = {
      sendPasswordReset: vi.fn().mockResolvedValue(undefined),
    };

    const selectLimit = vi.fn();
    const selectWhere = vi.fn(() => ({ limit: selectLimit }));
    const selectFrom = vi.fn(() => ({ where: selectWhere }));
    db = {
      select: vi.fn(() => ({ from: selectFrom })),
      insert: vi.fn(),
      update: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getDrizzleToken(), useValue: db },
        { provide: TokensService, useValue: tokens },
        { provide: EmailService, useValue: email },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  function mockSelectResult(rows: unknown[]) {
    const limit = vi.fn().mockResolvedValue(rows);
    const where = vi.fn(() => ({ limit }));
    const from = vi.fn(() => ({ where }));
    db.select.mockReturnValue({ from });
    return { limit, where, from };
  }

  describe('register', () => {
    const newUser = {
      name: 'Ada',
      userName: 'ada',
      email: 'a@b.com',
      password: 'password-1',
    };

    it('maps Drizzle-wrapped unique violation on insert to 409', async () => {
      mockSelectResult([]);
      const returning = vi.fn().mockRejectedValue({
        cause: {
          code: UNIQUE_VIOLATION,
          detail: 'Key (email)=(a@b.com) already exists.',
        },
      });
      db.insert.mockReturnValue({
        values: vi.fn().mockReturnValue({ returning }),
      });

      await expect(service.register(newUser)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('throws a generic error when the user is not found', async () => {
      mockSelectResult([]);

      await expect(
        service.login({ email: 'a@b.com', password: 'secret' }),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        service.login({ email: 'a@b.com', password: 'secret' }),
      ).rejects.toThrow('Invalid email or password');
    });

    it('throws the same generic error when the password is wrong', async () => {
      const password = await bcryptjs.hash('correct', BCRYPT_COST);
      mockSelectResult([{ id: 'id-1', userName: 'alice', password }]);

      await expect(
        service.login({ email: 'a@b.com', password: 'wrong' }),
      ).rejects.toThrow('Invalid email or password');
    });

    it('issues a token when credentials are valid', async () => {
      const password = await bcryptjs.hash('correct', BCRYPT_COST);
      mockSelectResult([{ id: 'id-1', userName: 'alice', password }]);

      await service.login({ email: 'a@b.com', password: 'correct' });

      expect(tokens.issueAccessToken).toHaveBeenCalledWith({
        id: 'id-1',
        userName: 'alice',
      });
    });
  });

  describe('forgotPassword', () => {
    it('stores a hashed reset token in the database', async () => {
      mockSelectResult([{ id: 'id-1', email: 'a@b.com' }]);

      const set = vi.fn();
      const where = vi.fn().mockResolvedValue(undefined);
      db.update.mockReturnValue({ set: set.mockReturnValue({ where }) });

      await service.forgotPassword({ email: 'a@b.com' });

      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({
          resetToken: expect.stringMatching(/^[a-f0-9]{64}$/),
        }),
      );
      const storedHash = set.mock.calls[0]![0].resetToken as string;
      expect(email.sendPasswordReset).toHaveBeenCalledWith(
        'a@b.com',
        expect.stringContaining('token='),
      );
      const link = email.sendPasswordReset.mock.calls[0]![1] as string;
      const rawToken = new URL(link).searchParams.get('token');
      expect(rawToken).toBeTruthy();
      expect(hashResetToken(rawToken!)).toBe(storedHash);
    });
  });

  describe('resetPassword', () => {
    it('looks up users by hashed token', async () => {
      const token = 'plain-reset-token';
      const { where } = mockSelectResult([
        {
          id: 'id-1',
          resetTokenExpiry: new Date(Date.now() + 60_000),
        },
      ]);

      const returning = vi.fn().mockResolvedValue([{ id: 'id-1' }]);
      const updateWhere = vi.fn().mockReturnValue({ returning });
      db.update.mockReturnValue({
        set: vi.fn().mockReturnValue({ where: updateWhere }),
      });

      await service.resetPassword({
        token,
        password: 'new-password-1',
        confirmPassword: 'new-password-1',
      });

      expect(where).toHaveBeenCalled();
      expect(updateWhere).toHaveBeenCalled();
    });
  });
});

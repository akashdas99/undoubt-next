import { ConflictException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { UNIQUE_VIOLATION } from '@/lib/constants.js';
import {
  duplicateFieldConflict,
  isUniqueViolation,
  pgErrorOf,
  uniqueViolationField,
} from './db-error.js';

describe('pgErrorOf', () => {
  it('reads code from a bare pg error', () => {
    expect(
      pgErrorOf({ code: UNIQUE_VIOLATION, detail: 'Key (email)=...' }),
    ).toEqual({
      code: UNIQUE_VIOLATION,
      detail: 'Key (email)=...',
      constraint: undefined,
    });
  });

  it('reads code from DrizzleQueryError-shaped wrapper', () => {
    expect(
      pgErrorOf({
        message: 'Failed query',
        cause: { code: UNIQUE_VIOLATION, detail: 'Key (user_name)=...' },
      }),
    ).toEqual({
      code: UNIQUE_VIOLATION,
      detail: 'Key (user_name)=...',
      constraint: undefined,
    });
  });

  it('returns undefined for non-objects', () => {
    expect(pgErrorOf('error')).toBeUndefined();
  });
});

describe('isUniqueViolation', () => {
  it('is true for 23505 on cause', () => {
    expect(isUniqueViolation({ cause: { code: UNIQUE_VIOLATION } })).toBe(true);
  });

  it('is false for other codes', () => {
    expect(isUniqueViolation({ code: '23503' })).toBe(false);
  });
});

describe('uniqueViolationField', () => {
  const map = { user_name: 'userName', email: 'email' };

  it('maps detail to API field name', () => {
    expect(
      uniqueViolationField(
        {
          code: UNIQUE_VIOLATION,
          detail: 'Key (email)=(a@b.com) already exists.',
        },
        map,
      ),
    ).toBe('email');
  });
});

describe('duplicateFieldConflict', () => {
  it('builds ConflictException body', () => {
    const err = duplicateFieldConflict('email', 'Email already exists');
    expect(err).toBeInstanceOf(ConflictException);
    expect(err.getResponse()).toEqual({
      errors: { email: { message: 'Email already exists' } },
    });
  });
});

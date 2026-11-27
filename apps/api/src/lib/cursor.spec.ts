import { BadRequestException } from '@nestjs/common';
import { questions } from '@workspace/db';
import { PgDialect } from 'drizzle-orm/pg-core';
import {
  beforeCursor,
  decodeCursor,
  encodeCursor,
  selectCursorTimestamp,
} from './cursor.js';

const updatedAt = '2024-01-15 12:34:56.123456';
const id = '11111111-1111-4111-8111-111111111111';

function cursorFor(value: { updatedAt: string; id: string }) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

describe('decodeCursor', () => {
  it('keeps the exact timestamp string', () => {
    expect(decodeCursor(encodeCursor({ updatedAt, id }))).toEqual({
      updatedAt,
      id,
    });
  });

  it('rejects an id that is not a uuid', () => {
    expect(() =>
      decodeCursor(cursorFor({ updatedAt, id: 'not-a-uuid' })),
    ).toThrow(BadRequestException);
  });

  it('rejects a timestamp that passed through toISOString', () => {
    expect(() =>
      decodeCursor(cursorFor({ updatedAt: '2024-01-15T12:34:56.123Z', id })),
    ).toThrow(BadRequestException);
  });

  it('rejects an impossible calendar day', () => {
    expect(() =>
      decodeCursor(cursorFor({ updatedAt: '2024-02-31 00:00:00.000000', id })),
    ).toThrow(BadRequestException);
  });

  it('rejects year 0000', () => {
    expect(() =>
      decodeCursor(cursorFor({ updatedAt: '0000-01-01 00:00:00.000000', id })),
    ).toThrow(BadRequestException);
  });

  it('accepts year 0001', () => {
    const yearOne = '0001-01-01 00:00:00.000000';
    expect(decodeCursor(cursorFor({ updatedAt: yearOne, id }))).toEqual({
      updatedAt: yearOne,
      id,
    });
  });
});

describe('selectCursorTimestamp', () => {
  it('reads the timestamp as microsecond text', () => {
    const query = new PgDialect().sqlToQuery(
      selectCursorTimestamp(questions.updatedAt),
    );

    expect(query.sql).toContain(
      'to_char("questions"."updated_at", \'YYYY-MM-DD HH24:MI:SS.US\')',
    );
  });
});

describe('beforeCursor', () => {
  it('compares the exact timestamp text and keeps the id tie-breaker', () => {
    const query = new PgDialect().sqlToQuery(
      beforeCursor(questions.updatedAt, questions.id, { updatedAt, id }),
    );

    expect(query.sql).toContain('::timestamp');
    expect(query.sql).toContain('<');
    expect(query.params).toEqual([updatedAt, updatedAt, id]);
  });
});

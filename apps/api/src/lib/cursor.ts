import { BadRequestException } from '@nestjs/common';
import { z } from '@workspace/validations/zod';
import { and, lt, or, sql, type AnyColumn, type SQL } from 'drizzle-orm';

export type PageCursor = { updatedAt: string; id: string };

const CURSOR_TIMESTAMP =
  /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})\.(\d{6})$/;

export function selectCursorTimestamp(column: AnyColumn) {
  return sql<string>`to_char(${column}, 'YYYY-MM-DD HH24:MI:SS.US')`;
}

function isCursorTimestamp(value: string) {
  const match = CURSOR_TIMESTAMP.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  if (
    year < 1 ||
    month < 1 ||
    month > 12 ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return false;
  }
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day >= 1 && day <= days[month - 1];
}

export function encodeCursor(row: { updatedAt: string; id: string }) {
  return Buffer.from(
    JSON.stringify({
      updatedAt: row.updatedAt,
      id: row.id,
    }),
  ).toString('base64url');
}

export function decodeCursor(value: string): PageCursor {
  try {
    const parsed = JSON.parse(
      Buffer.from(value, 'base64url').toString('utf8'),
    ) as { updatedAt?: unknown; id?: unknown };
    if (typeof parsed.updatedAt !== 'string' || typeof parsed.id !== 'string') {
      throw new Error('shape');
    }
    if (!isCursorTimestamp(parsed.updatedAt)) {
      throw new Error('date');
    }
    if (!z.string().uuid().safeParse(parsed.id).success) {
      throw new Error('id');
    }
    return { updatedAt: parsed.updatedAt, id: parsed.id };
  } catch {
    throw new BadRequestException('Invalid cursor');
  }
}

export function beforeCursor(
  updatedAt: AnyColumn,
  id: AnyColumn,
  cursor: PageCursor,
): SQL {
  const older = or(
    sql`${updatedAt} < ${cursor.updatedAt}::timestamp`,
    and(sql`${updatedAt} = ${cursor.updatedAt}::timestamp`, lt(id, cursor.id)),
  );
  if (!older) {
    throw new BadRequestException('Invalid cursor');
  }
  return older;
}

import { BadRequestException } from '@nestjs/common';
import { and, eq, lt, or, type AnyColumn, type SQL } from 'drizzle-orm';

export type PageCursor = { updatedAt: Date; id: string };

export function encodeCursor(row: { updatedAt: Date; id: string }) {
  return Buffer.from(
    JSON.stringify({
      updatedAt: row.updatedAt.toISOString(),
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
    const updatedAt = new Date(parsed.updatedAt);
    if (Number.isNaN(updatedAt.getTime())) {
      throw new Error('date');
    }
    return { updatedAt, id: parsed.id };
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
    lt(updatedAt, cursor.updatedAt),
    and(eq(updatedAt, cursor.updatedAt), lt(id, cursor.id)),
  );
  if (!older) {
    throw new BadRequestException('Invalid cursor');
  }
  return older;
}

import { ConflictException } from '@nestjs/common';
import { UNIQUE_VIOLATION } from '@/lib/constants.js';

type PgErrorShape = {
  code?: string;
  detail?: string;
  constraint?: string;
};

export function pgErrorOf(error: unknown): PgErrorShape | undefined {
  let current: unknown = error;
  while (current !== null && typeof current === 'object') {
    const record = current as Record<string, unknown>;
    if (typeof record.code === 'string') {
      return {
        code: record.code,
        detail: typeof record.detail === 'string' ? record.detail : undefined,
        constraint:
          typeof record.constraint === 'string' ? record.constraint : undefined,
      };
    }
    current = 'cause' in record ? record.cause : undefined;
  }
  return undefined;
}

export function isUniqueViolation(error: unknown): boolean {
  return pgErrorOf(error)?.code === UNIQUE_VIOLATION;
}

export function uniqueViolationField(
  error: unknown,
  columnToField: Record<string, string>,
): string | undefined {
  const pg = pgErrorOf(error);
  if (!pg) {
    return undefined;
  }
  const haystack = `${pg.detail ?? ''} ${pg.constraint ?? ''}`;
  for (const [column, field] of Object.entries(columnToField)) {
    if (haystack.includes(column)) {
      return field;
    }
  }
  return undefined;
}

export function duplicateFieldConflict(
  field: string,
  message: string,
): ConflictException {
  return new ConflictException({
    errors: { [field]: { message } },
  });
}

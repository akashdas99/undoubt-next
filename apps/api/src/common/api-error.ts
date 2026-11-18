import { TITLE_BY_STATUS } from '@/lib/constants.js';

export type InvalidParam = {
  name: string;
  reason: string;
};

export type ProblemDetails = {
  type: 'about:blank';
  title: string;
  status: number;
  detail: string;
  'invalid-params'?: InvalidParam[];
};

function titleFor(status: number): string {
  return TITLE_BY_STATUS[status] ?? 'Error';
}

function messageFromNestBody(message: unknown): string {
  if (typeof message === 'string') {
    return message;
  }
  if (Array.isArray(message)) {
    const parts = message.filter(
      (part): part is string => typeof part === 'string',
    );
    if (parts.length > 0) {
      return parts.join(', ');
    }
  }
  return 'Something went wrong';
}

function fieldName(path: unknown): string | undefined {
  if (typeof path === 'string' && path.length > 0) {
    return path;
  }
  if (typeof path === 'number') {
    return String(path);
  }
  if (Array.isArray(path) && path.length > 0) {
    return fieldName(path[0]);
  }
  return undefined;
}

function invalidParams(errors: unknown): InvalidParam[] | undefined {
  if (Array.isArray(errors)) {
    const params: InvalidParam[] = [];
    for (const issue of errors) {
      if (issue === null || typeof issue !== 'object') {
        continue;
      }
      const record = issue as Record<string, unknown>;
      const reason =
        typeof record.reason === 'string'
          ? record.reason
          : typeof record.message === 'string'
            ? record.message
            : undefined;
      const name = fieldName(record.name ?? record.path);
      if (!reason || !name) {
        continue;
      }
      params.push({ name, reason });
    }
    return params.length > 0 ? params : undefined;
  }

  if (errors === null || typeof errors !== 'object') {
    return undefined;
  }

  const params: InvalidParam[] = [];
  for (const [name, value] of Object.entries(errors)) {
    if (
      value !== null &&
      typeof value === 'object' &&
      'message' in value &&
      typeof value.message === 'string'
    ) {
      params.push({ name, reason: value.message });
    }
  }
  return params.length > 0 ? params : undefined;
}

export function problemFromException(
  status: number,
  exceptionResponse: string | object,
): ProblemDetails {
  const title = titleFor(status);
  if (typeof exceptionResponse === 'string') {
    return { type: 'about:blank', title, status, detail: exceptionResponse };
  }

  const body = exceptionResponse as Record<string, unknown>;
  const params = invalidParams(body.errors);
  const detail = params?.[0]?.reason ?? messageFromNestBody(body.message);
  if (!params) {
    return { type: 'about:blank', title, status, detail };
  }
  return {
    type: 'about:blank',
    title,
    status,
    detail,
    'invalid-params': params,
  };
}

export function internalServerErrorProblem(): ProblemDetails {
  return problemFromException(500, 'Something went wrong');
}

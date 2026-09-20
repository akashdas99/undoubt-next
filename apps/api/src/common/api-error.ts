export type FieldErrorMap = Record<string, { message: string }>;

export type ApiErrorBody = {
  message: string;
  errors?: FieldErrorMap | Array<{ path?: unknown; message?: unknown }>;
};

function messageFromNestBody(message: unknown): string {
  if (typeof message === 'string') {
    return message;
  }
  if (Array.isArray(message)) {
    const parts = message.filter((m): m is string => typeof m === 'string');
    if (parts.length > 0) {
      return parts.join(', ');
    }
  }
  return 'Something went wrong';
}

function firstFieldMessage(errors: unknown): string | undefined {
  if (errors === null || errors === undefined) {
    return undefined;
  }
  if (Array.isArray(errors)) {
    for (const issue of errors) {
      if (issue && typeof issue === 'object') {
        const msg = (issue as { message?: unknown }).message;
        if (typeof msg === 'string') {
          return msg;
        }
      }
    }
    return undefined;
  }
  if (typeof errors === 'object') {
    for (const value of Object.values(errors as Record<string, unknown>)) {
      if (value && typeof value === 'object') {
        const msg = (value as { message?: unknown }).message;
        if (typeof msg === 'string') {
          return msg;
        }
      }
    }
  }
  return undefined;
}

export function errorBodyFromHttpException(
  exceptionResponse: string | object,
): ApiErrorBody {
  if (typeof exceptionResponse === 'string') {
    return { message: exceptionResponse };
  }

  const body = exceptionResponse as Record<string, unknown>;
  const errors = body.errors;

  if (errors !== undefined) {
    const message =
      firstFieldMessage(errors) ?? messageFromNestBody(body.message);
    return {
      message,
      errors: errors as ApiErrorBody['errors'],
    };
  }

  return { message: messageFromNestBody(body.message) };
}

export function internalServerErrorBody(): ApiErrorBody {
  return { message: 'Something went wrong' };
}

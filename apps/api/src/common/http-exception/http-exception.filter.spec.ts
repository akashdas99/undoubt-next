import {
  ArgumentsHost,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter.js';

function createHost(response: {
  status: ReturnType<typeof vi.fn>;
  type: ReturnType<typeof vi.fn>;
  send: ReturnType<typeof vi.fn>;
}): ArgumentsHost {
  return {
    switchToHttp: () => ({
      getResponse: () => response,
    }),
  } as ArgumentsHost;
}

function replyMock() {
  const send = vi.fn();
  const type = vi.fn().mockReturnThis();
  const status = vi.fn().mockReturnValue({ type, send });
  return { status, type, send };
}

describe('HttpExceptionFilter', () => {
  const filter = new HttpExceptionFilter();

  it('sends problem details for UnauthorizedException', () => {
    const res = replyMock();

    filter.catch(
      new UnauthorizedException('Invalid credentials'),
      createHost(res),
    );

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.type).toHaveBeenCalledWith('application/problem+json');
    expect(res.send).toHaveBeenCalledWith({
      type: 'about:blank',
      title: 'Unauthorized',
      status: 401,
      detail: 'Invalid credentials',
    });
  });

  it('sends invalid-params for a field-error ConflictException', () => {
    const res = replyMock();

    filter.catch(
      new ConflictException({
        errors: { email: { message: 'Email already exists' } },
      }),
      createHost(res),
    );

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith({
      type: 'about:blank',
      title: 'Conflict',
      status: 409,
      detail: 'Email already exists',
      'invalid-params': [{ name: 'email', reason: 'Email already exists' }],
    });
  });

  it('sends a generic problem for an unknown error', () => {
    const res = replyMock();

    filter.catch(new Error('boom'), createHost(res));

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      type: 'about:blank',
      title: 'Internal Server Error',
      status: 500,
      detail: 'Something went wrong',
    });
  });
});

import {
  ArgumentsHost,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter.js';

function createHost(response: {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
}): ArgumentsHost {
  return {
    switchToHttp: () => ({
      getResponse: () => response,
    }),
  } as ArgumentsHost;
}

describe('HttpExceptionFilter', () => {
  const filter = new HttpExceptionFilter();

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('responds with message for UnauthorizedException', () => {
    const status = vi.fn().mockReturnThis();
    const json = vi.fn();
    const res = { status, json };

    filter.catch(
      new UnauthorizedException('Invalid credentials'),
      createHost(res),
    );

    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid credentials' }),
    );
  });

  it('responds with errors for field-error ConflictException', () => {
    const status = vi.fn().mockReturnThis();
    const json = vi.fn();
    const res = { status, json };

    filter.catch(
      new ConflictException({
        errors: { email: { message: 'Email already exists' } },
      }),
      createHost(res),
    );

    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith({
      message: 'Email already exists',
      errors: { email: { message: 'Email already exists' } },
    });
  });

  it('responds with 500 message for generic Error', () => {
    const status = vi.fn().mockReturnThis();
    const json = vi.fn();
    const res = { status, json };

    filter.catch(new Error('boom'), createHost(res));

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: 'Something went wrong' });
  });
});

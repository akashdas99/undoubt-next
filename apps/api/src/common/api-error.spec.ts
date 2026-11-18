import { ConflictException, HttpStatus } from '@nestjs/common';
import {
  internalServerErrorProblem,
  problemFromException,
} from './api-error.js';

describe('problemFromException', () => {
  it('maps a string body to problem detail', () => {
    expect(
      problemFromException(HttpStatus.UNAUTHORIZED, 'Invalid credentials'),
    ).toEqual({
      type: 'about:blank',
      title: 'Unauthorized',
      status: 401,
      detail: 'Invalid credentials',
    });
  });

  it('maps field errors to invalid-params', () => {
    expect(
      problemFromException(HttpStatus.CONFLICT, {
        errors: { email: { message: 'Email already exists' } },
      }),
    ).toEqual({
      type: 'about:blank',
      title: 'Conflict',
      status: 409,
      detail: 'Email already exists',
      'invalid-params': [{ name: 'email', reason: 'Email already exists' }],
    });
  });

  it('joins Nest validation message arrays into detail', () => {
    expect(
      problemFromException(HttpStatus.BAD_REQUEST, {
        statusCode: 400,
        message: ['email is invalid'],
        error: 'Bad Request',
      }),
    ).toEqual({
      type: 'about:blank',
      title: 'Bad Request',
      status: 400,
      detail: 'email is invalid',
    });
  });
});

describe('internalServerErrorProblem', () => {
  it('hides the thrown message', () => {
    expect(internalServerErrorProblem()).toEqual({
      type: 'about:blank',
      title: 'Internal Server Error',
      status: 500,
      detail: 'Something went wrong',
    });
  });
});

describe('ConflictException integration', () => {
  it('matches the thrown field-error shape', () => {
    const ex = new ConflictException({
      errors: { email: { message: 'Email already exists' } },
    });
    expect(problemFromException(ex.getStatus(), ex.getResponse())).toEqual({
      type: 'about:blank',
      title: 'Conflict',
      status: 409,
      detail: 'Email already exists',
      'invalid-params': [{ name: 'email', reason: 'Email already exists' }],
    });
  });
});

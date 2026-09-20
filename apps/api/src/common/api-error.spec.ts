import { ConflictException } from '@nestjs/common';
import {
  errorBodyFromHttpException,
  internalServerErrorBody,
} from './api-error.js';

describe('errorBodyFromHttpException', () => {
  it('maps string exception body to message', () => {
    expect(errorBodyFromHttpException('Invalid credentials')).toEqual({
      message: 'Invalid credentials',
    });
  });

  it('maps field errors and uses first field message', () => {
    expect(
      errorBodyFromHttpException({
        errors: { email: { message: 'Email already exists' } },
      }),
    ).toEqual({
      message: 'Email already exists',
      errors: { email: { message: 'Email already exists' } },
    });
  });

  it('joins Nest validation message arrays', () => {
    expect(
      errorBodyFromHttpException({
        statusCode: 400,
        message: ['email is invalid'],
        error: 'Bad Request',
      }),
    ).toEqual({
      message: 'email is invalid',
    });
  });
});

describe('internalServerErrorBody', () => {
  it('returns generic message', () => {
    expect(internalServerErrorBody()).toEqual({
      message: 'Something went wrong',
    });
  });
});

describe('ConflictException integration', () => {
  it('matches thrown field-error shape', () => {
    const ex = new ConflictException({
      errors: { email: { message: 'Email already exists' } },
    });
    expect(errorBodyFromHttpException(ex.getResponse())).toEqual({
      message: 'Email already exists',
      errors: { email: { message: 'Email already exists' } },
    });
  });
});

import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { LOGIN_REQUIRED_MESSAGE } from '../../lib/constants.js';

/** JWT access-token payload attached to `request.user` after auth. */
export type RequestUser = {
  id: string;
  userName: string;
};

export type RequestWithUser = FastifyRequest & { user?: RequestUser };

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RequestUser => {
    const user = context.switchToHttp().getRequest<RequestWithUser>().user;
    if (!user) {
      throw new UnauthorizedException(LOGIN_REQUIRED_MESSAGE);
    }
    return user;
  },
);

export const OptionalUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RequestUser | undefined =>
    context.switchToHttp().getRequest<RequestWithUser>().user,
);

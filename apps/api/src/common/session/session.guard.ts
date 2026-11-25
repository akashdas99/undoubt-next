import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ACCESS_COOKIE } from '@workspace/constants';
import type { FastifyRequest } from 'fastify';
import { LOGIN_REQUIRED_MESSAGE } from '../../lib/constants.js';
import { TokensService } from '../../auth/tokens/tokens.service.js';
import type { RequestWithUser } from './user.js';

const OPTIONAL_SESSION = 'optionalSession';

export const OptionalSession = () => SetMetadata(OPTIONAL_SESSION, true);

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private readonly tokens: TokensService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const optional = this.reflector.getAllAndOverride<boolean>(
      OPTIONAL_SESSION,
      [context.getHandler(), context.getClass()],
    );
    const request = context
      .switchToHttp()
      .getRequest<RequestWithUser & FastifyRequest>();
    const token = request.cookies?.[ACCESS_COOKIE];
    const user = token
      ? ((await this.tokens.verifyAccessToken(token)) ?? undefined)
      : undefined;
    if (!user && !optional) {
      throw new UnauthorizedException(LOGIN_REQUIRED_MESSAGE);
    }
    request.user = user;
    return true;
  }
}

import '@fastify/cookie';
import type { FastifyReply } from 'fastify';
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE_SECONDS,
  LEGACY_REFRESH_COOKIE,
} from '@/lib/constants.js';
import { AccessToken } from './tokens/tokens.service.js';

export { ACCESS_COOKIE };

export type AuthCookieOptions = {
  secure: boolean;
  domain?: string;
};

function cookieBase(options: AuthCookieOptions) {
  return {
    httpOnly: true,
    secure: options.secure,
    sameSite: 'lax' as const,
    path: '/',
    ...(options.domain ? { domain: options.domain } : {}),
  };
}

function clearCookieOptions(options: AuthCookieOptions) {
  return {
    path: '/',
    ...(options.domain ? { domain: options.domain } : {}),
  };
}

export function setAuthCookies(
  reply: FastifyReply,
  tokens: AccessToken,
  options: AuthCookieOptions,
) {
  reply.setCookie(ACCESS_COOKIE, tokens.accessToken, {
    ...cookieBase(options),
    maxAge: ACCESS_MAX_AGE_SECONDS,
  });
}

export function clearAuthCookies(
  reply: FastifyReply,
  options: AuthCookieOptions,
) {
  const clearOptions = clearCookieOptions(options);
  reply.clearCookie(ACCESS_COOKIE, clearOptions);
  reply.clearCookie(LEGACY_REFRESH_COOKIE, clearOptions);
}

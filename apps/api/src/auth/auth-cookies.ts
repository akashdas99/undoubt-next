import type { Response } from 'express';
import { AccessToken } from './tokens/tokens.service.js';

export const ACCESS_COOKIE = 'access_token';

/** Legacy cookie name; cleared on logout so old sessions are dropped. */
const LEGACY_REFRESH_COOKIE = 'refresh_token';

const ACCESS_MAX_AGE_MS = 15 * 60 * 1000;

function cookieBase() {
  const secure = process.env.NODE_ENV === 'production';
  const domain = process.env.COOKIE_DOMAIN;
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    path: '/',
    ...(domain ? { domain } : {}),
  };
}

function clearCookieOptions() {
  const domain = process.env.COOKIE_DOMAIN;
  return {
    path: '/',
    ...(domain ? { domain } : {}),
  };
}

export function setAuthCookies(res: Response, tokens: AccessToken) {
  res.cookie(ACCESS_COOKIE, tokens.accessToken, {
    ...cookieBase(),
    maxAge: ACCESS_MAX_AGE_MS,
  });
}

export function clearAuthCookies(res: Response) {
  const options = clearCookieOptions();
  res.clearCookie(ACCESS_COOKIE, options);
  res.clearCookie(LEGACY_REFRESH_COOKIE, options);
}

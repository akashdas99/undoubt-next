import { ACCESS_COOKIE } from '@workspace/constants';
import {
  clearAuthCookies,
  setAuthCookies,
  type AuthCookieOptions,
} from './auth-cookies.js';

describe('auth cookies', () => {
  it('set and clear use the same domain when COOKIE_DOMAIN is configured', () => {
    const options: AuthCookieOptions = {
      secure: true,
      domain: '.example.com',
    };

    const setCalls: { name: string; opts: Record<string, unknown> }[] = [];
    const clearCalls: { name: string; opts: Record<string, unknown> }[] = [];
    const reply = {
      setCookie: (
        name: string,
        _value: string,
        opts: Record<string, unknown>,
      ) => {
        setCalls.push({ name, opts });
      },
      clearCookie: (name: string, opts: Record<string, unknown>) => {
        clearCalls.push({ name, opts });
      },
    };

    setAuthCookies(reply as never, { accessToken: 'token' }, options);
    clearAuthCookies(reply as never, options);

    expect(setCalls).toHaveLength(1);
    expect(setCalls[0]?.opts.domain).toBe('.example.com');
    expect(setCalls[0]?.opts.path).toBe('/');

    const accessClear = clearCalls.find((call) => call.name === ACCESS_COOKIE);
    expect(accessClear?.opts.domain).toBe('.example.com');
    expect(accessClear?.opts.path).toBe('/');
  });
});

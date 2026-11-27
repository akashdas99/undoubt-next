import { type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokensService } from '../../auth/tokens/tokens.service.js';
import { LOGIN_REQUIRED_MESSAGE } from '../../lib/constants.js';
import { SessionGuard } from './session.guard.js';

function createContext(cookies?: Record<string, string>): ExecutionContext {
  const request: { cookies?: Record<string, string>; user?: unknown } = {
    cookies,
  };
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  } as ExecutionContext;
}

describe('SessionGuard', () => {
  const verifyAccessToken = vi.fn();
  const tokens = { verifyAccessToken } as unknown as TokensService;
  let reflector: Reflector;
  let guard: SessionGuard;

  beforeEach(() => {
    verifyAccessToken.mockReset();
    reflector = {
      getAllAndOverride: vi.fn(),
    } as unknown as Reflector;
    guard = new SessionGuard(tokens, reflector);
  });

  it('allows @Public routes without reading the session cookie', async () => {
    vi.mocked(reflector.getAllAndOverride).mockImplementation((key) => {
      if (key === 'publicRoute') {
        return true;
      }
      return false;
    });

    const allowed = await guard.canActivate(createContext());

    expect(allowed).toBe(true);
    expect(verifyAccessToken).not.toHaveBeenCalled();
  });

  it('rejects unauthenticated requests on protected routes', async () => {
    vi.mocked(reflector.getAllAndOverride).mockReturnValue(false);

    await expect(guard.canActivate(createContext())).rejects.toMatchObject({
      response: { message: LOGIN_REQUIRED_MESSAGE, statusCode: 401 },
    });
    expect(verifyAccessToken).not.toHaveBeenCalled();
  });
});

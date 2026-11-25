import { MIN_SECRET_LENGTH } from '@workspace/constants';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SignJWT } from 'jose';
import { TokensService } from './tokens.service.js';

function configWithSecret(secret: string | undefined) {
  return {
    getOrThrow: (key: string) => {
      if (key === 'SECRET') {
        if (secret === undefined) {
          throw new Error('SECRET is not set');
        }
        return secret;
      }
      throw new Error(`${key} is not set`);
    },
  };
}

describe('TokensService', () => {
  let service: TokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokensService,
        {
          provide: ConfigService,
          useValue: configWithSecret('a'.repeat(MIN_SECRET_LENGTH)),
        },
      ],
    }).compile();

    service = module.get<TokensService>(TokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns the user for a token it signed', async () => {
    const { accessToken } = await service.issueAccessToken({
      id: 'user-id',
      userName: 'ada',
    });

    await expect(service.verifyAccessToken(accessToken)).resolves.toEqual({
      id: 'user-id',
      userName: 'ada',
    });
  });

  it('returns null for a token it did not sign', async () => {
    await expect(service.verifyAccessToken('not-a-token')).resolves.toBeNull();
  });

  it('returns null for a valid token signed with a different secret', async () => {
    const wrongKey = new TextEncoder().encode('b'.repeat(MIN_SECRET_LENGTH));
    const token = await new SignJWT({ id: 'user-id', userName: 'ada' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(wrongKey);

    await expect(service.verifyAccessToken(token)).resolves.toBeNull();
  });

  it('returns null for an expired token signed with the configured secret', async () => {
    const key = new TextEncoder().encode('a'.repeat(MIN_SECRET_LENGTH));
    const token = await new SignJWT({ id: 'user-id', userName: 'ada' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
      .sign(key);

    await expect(service.verifyAccessToken(token)).resolves.toBeNull();
  });

  it(`rejects a SECRET shorter than ${MIN_SECRET_LENGTH} characters`, async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokensService,
        {
          provide: ConfigService,
          useValue: configWithSecret('too-short'),
        },
      ],
    }).compile();
    const shortSecretService = module.get<TokensService>(TokensService);

    await expect(
      shortSecretService.issueAccessToken({ id: 'id', userName: 'user' }),
    ).rejects.toThrow(
      `SECRET must be at least ${MIN_SECRET_LENGTH} characters`,
    );
  });
});

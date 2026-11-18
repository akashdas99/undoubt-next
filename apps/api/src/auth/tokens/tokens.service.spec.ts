import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
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
          useValue: configWithSecret('a'.repeat(32)),
        },
      ],
    }).compile();

    service = module.get<TokensService>(TokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns the viewer for a token it signed', async () => {
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

  it('rejects a SECRET shorter than 32 characters', async () => {
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
    ).rejects.toThrow('SECRET must be at least 32 characters');
  });
});

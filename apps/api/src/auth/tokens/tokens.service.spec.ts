import { Test, TestingModule } from '@nestjs/testing';
import { TokensService } from './tokens.service.js';

describe('TokensService', () => {
  let service: TokensService;

  beforeEach(async () => {
    process.env.SECRET = 'a'.repeat(32);
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokensService],
    }).compile();

    service = module.get<TokensService>(TokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('rejects a SECRET shorter than 32 characters', async () => {
    process.env.SECRET = 'too-short';
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokensService],
    }).compile();
    const shortSecretService = module.get<TokensService>(TokensService);

    await expect(
      shortSecretService.issueAccessToken({ id: 'id', userName: 'user' }),
    ).rejects.toThrow('SECRET must be at least 32 characters');
  });
});

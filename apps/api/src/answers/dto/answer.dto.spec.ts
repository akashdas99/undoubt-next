import { ListAnswersQueryDto } from './answer.dto.js';

describe('ListAnswersQueryDto', () => {
  it('defaults limit to 50 and rejects values above 100', () => {
    expect(ListAnswersQueryDto.schema.parse({}).limit).toBe(50);
    expect(ListAnswersQueryDto.schema.safeParse({ limit: 100 }).success).toBe(
      true,
    );
    expect(ListAnswersQueryDto.schema.safeParse({ limit: 101 }).success).toBe(
      false,
    );
    expect(ListAnswersQueryDto.schema.safeParse({ limit: 0 }).success).toBe(
      false,
    );
  });
});

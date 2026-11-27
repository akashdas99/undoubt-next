import { EditQuestionDto, ListQuestionsQueryDto } from './question.dto.js';

describe('EditQuestionDto', () => {
  it('accepts title and description without a body id', () => {
    expect(
      EditQuestionDto.schema.parse({
        title: 'A long enough title',
        description: 'body',
      }),
    ).toEqual({
      title: 'A long enough title',
      description: 'body',
    });
  });
});

describe('ListQuestionsQueryDto', () => {
  it('defaults limit to 10 and rejects values above 100', () => {
    expect(ListQuestionsQueryDto.schema.parse({}).limit).toBe(10);
    expect(ListQuestionsQueryDto.schema.safeParse({ limit: 100 }).success).toBe(
      true,
    );
    expect(ListQuestionsQueryDto.schema.safeParse({ limit: 101 }).success).toBe(
      false,
    );
    expect(ListQuestionsQueryDto.schema.safeParse({ limit: 0 }).success).toBe(
      false,
    );
  });
});

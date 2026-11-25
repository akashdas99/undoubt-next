import {
  EditQuestionSchema,
  QuestionSchema,
  VoteBodySchema,
} from '@workspace/validations/question';
import { z } from '@workspace/validations/zod';
import { createZodDto } from 'nestjs-zod';

export class QuestionDto extends createZodDto(QuestionSchema) {}
export class EditQuestionDto extends createZodDto(EditQuestionSchema) {}
export class VoteBodyDto extends createZodDto(VoteBodySchema) {}

export class ListQuestionsQueryDto extends createZodDto(
  z.object({
    keyword: z.string().optional().default(''),
    cursor: z.string().optional(),
    limit: z.coerce.number().int().positive().default(10),
  }),
) {}

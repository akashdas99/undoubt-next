import { AnswerSchema } from '@workspace/validations/answer';
import { z } from '@workspace/validations/zod';
import { createZodDto } from 'nestjs-zod';

export class AnswerDto extends createZodDto(AnswerSchema) {}

export class ListAnswersQueryDto extends createZodDto(
  z.object({
    cursor: z.string().optional(),
    limit: z.coerce.number().int().positive().default(50),
  }),
) {}

import { z } from '@workspace/validations/zod';
import { createZodDto } from 'nestjs-zod';

export class TopContributorsQueryDto extends createZodDto(
  z.object({
    limit: z.coerce.number().int().positive().default(10),
  }),
) {}

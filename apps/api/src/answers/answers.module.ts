import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller.js';
import { AnswersService } from './answers.service.js';

@Module({
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule {}

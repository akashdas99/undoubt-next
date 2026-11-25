import { Module } from '@nestjs/common';
import { SessionModule } from '../common/session/session.module.js';
import { AnswersController } from './answers.controller.js';
import { AnswersService } from './answers.service.js';

@Module({
  imports: [SessionModule],
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule {}

import { Module } from '@nestjs/common';
import { SessionModule } from '../common/session/session.module.js';
import { QuestionsController } from './questions.controller.js';
import { QuestionsService } from './questions.service.js';

@Module({
  imports: [SessionModule],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}

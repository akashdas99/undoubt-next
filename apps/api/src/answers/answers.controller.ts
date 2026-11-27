import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/session/session.guard.js';
import { CurrentUser, type RequestUser } from '../common/session/user.js';
import { AnswerDto, ListAnswersQueryDto } from './dto/answer.dto.js';
import { AnswersService } from './answers.service.js';

@ApiTags('answers')
@Controller()
export class AnswersController {
  constructor(private readonly answers: AnswersService) {}

  @Get('questions/:slug/answers')
  @Public()
  @ApiOperation({ summary: 'Answers for a question' })
  list(@Param('slug') slug: string, @Query() query: ListAnswersQueryDto) {
    return this.answers.listByQuestionSlug(slug, query.limit, query.cursor);
  }

  @Post('questions/:slug/answers')
  @HttpCode(201)
  @ApiOperation({ summary: 'Add an answer' })
  create(
    @CurrentUser() user: RequestUser,
    @Param('slug') slug: string,
    @Body() body: AnswerDto,
  ) {
    return this.answers.create(user, slug, body);
  }

  @Patch('answers/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Update an answer' })
  update(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AnswerDto,
  ) {
    return this.answers.update(user, id, body);
  }

  @Delete('answers/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete an answer' })
  remove(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.answers.remove(user, id);
  }
}

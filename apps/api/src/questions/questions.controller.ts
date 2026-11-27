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
import { OptionalSession } from '../common/session/session.guard.js';
import {
  CurrentUser,
  OptionalUser,
  type RequestUser,
} from '../common/session/user.js';
import {
  EditQuestionDto,
  ListQuestionsQueryDto,
  QuestionDto,
  VoteBodyDto,
} from './dto/question.dto.js';
import { QuestionsService } from './questions.service.js';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questions: QuestionsService) {}

  @Get()
  @OptionalSession()
  @ApiOperation({ summary: 'List questions' })
  list(
    @OptionalUser() user: RequestUser | undefined,
    @Query() query: ListQuestionsQueryDto,
  ) {
    return this.questions.list(
      query.keyword,
      query.limit,
      query.cursor,
      user?.id ?? null,
    );
  }

  @Get('slugs')
  @OptionalSession()
  @ApiOperation({ summary: 'All question slugs for static generation' })
  slugs() {
    return this.questions.allSlugs();
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a question' })
  create(@CurrentUser() user: RequestUser, @Body() body: QuestionDto) {
    return this.questions.create(user, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a question' })
  update(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: EditQuestionDto,
  ) {
    return this.questions.update(user, { ...body, id });
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a question' })
  remove(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.questions.remove(user, { id });
  }

  @Post(':id/vote')
  @HttpCode(204)
  @ApiOperation({ summary: 'Vote on a question' })
  vote(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: VoteBodyDto,
  ) {
    return this.questions.vote(user, id, body.voteType);
  }

  @Get(':slug/content')
  @OptionalSession()
  @ApiOperation({ summary: 'Question content by slug' })
  content(@Param('slug') slug: string) {
    return this.questions.contentBySlug(slug);
  }

  @Get(':slug/stats')
  @OptionalSession()
  @ApiOperation({ summary: 'Question stats by slug' })
  stats(
    @OptionalUser() user: RequestUser | undefined,
    @Param('slug') slug: string,
  ) {
    return this.questions.statsBySlug(slug, user?.id ?? null);
  }

  @Get(':slug')
  @OptionalSession()
  @ApiOperation({ summary: 'Question by slug' })
  bySlug(
    @OptionalUser() user: RequestUser | undefined,
    @Param('slug') slug: string,
  ) {
    return this.questions.bySlug(slug, user?.id ?? null);
  }
}

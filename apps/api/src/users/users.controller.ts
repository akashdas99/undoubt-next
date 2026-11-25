import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SessionGuard } from '../common/session/session.guard.js';
import { CurrentUser, type RequestUser } from '../common/session/user.js';
import { TopContributorsQueryDto } from './dto/users-query.dto.js';
import { UsersService } from './users.service.js';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: 'Current user profile' })
  me(@CurrentUser() user: RequestUser) {
    return this.users.profile(user);
  }

  @Get('top')
  @ApiOperation({ summary: 'Top contributors' })
  top(@Query() query: TopContributorsQueryDto) {
    return this.users.topContributors(query.limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'User by id' })
  byId(@Param('id', ParseUUIDPipe) id: string) {
    return this.users.byId(id);
  }
}

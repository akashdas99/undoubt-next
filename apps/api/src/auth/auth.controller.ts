import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import {
  LOGIN_THROTTLE_LIMIT,
  SENSITIVE_THROTTLE_LIMIT,
  THROTTLE_WINDOW_MS,
} from '@workspace/constants';
import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  ACCESS_COOKIE,
  type AuthCookieOptions,
  clearAuthCookies,
  setAuthCookies,
} from './auth-cookies.js';
import { Public } from '../common/session/session.guard.js';
import { AuthService } from './auth.service.js';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto.js';
import { TokensService } from './tokens/tokens.service.js';

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly tokens: TokensService,
    private readonly config: ConfigService,
  ) {}

  private authCookieOptions(): AuthCookieOptions {
    const domain = this.config.get<string>('COOKIE_DOMAIN');
    return {
      secure: this.config.get<string>('NODE_ENV') === 'production',
      ...(domain ? { domain } : {}),
    };
  }

  @SkipThrottle()
  @Get('session')
  @ApiOperation({ summary: 'Read the current session' })
  async session(@Req() request: FastifyRequest) {
    const token = request.cookies?.[ACCESS_COOKIE];
    if (!token) {
      return { data: null };
    }
    const user = await this.tokens.verifyAccessToken(token);
    return { data: user };
  }

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new account' })
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const tokens = await this.auth.register(body);
    setAuthCookies(reply, tokens, this.authCookieOptions());
  }

  @Post('login')
  @HttpCode(204)
  @Throttle({
    default: { limit: LOGIN_THROTTLE_LIMIT, ttl: THROTTLE_WINDOW_MS },
  })
  @ApiOperation({ summary: 'Log in with email and password' })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const tokens = await this.auth.login(body);
    setAuthCookies(reply, tokens, this.authCookieOptions());
  }

  @Post('logout')
  @HttpCode(204)
  @ApiOperation({ summary: 'Clear session cookies' })
  async logout(@Res({ passthrough: true }) reply: FastifyReply) {
    clearAuthCookies(reply, this.authCookieOptions());
  }

  @Post('forgot-password')
  @HttpCode(204)
  @Throttle({
    default: { limit: SENSITIVE_THROTTLE_LIMIT, ttl: THROTTLE_WINDOW_MS },
  })
  @ApiOperation({ summary: 'Request a password reset email' })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    await this.auth.forgotPassword(body);
  }

  @Post('reset-password')
  @HttpCode(204)
  @Throttle({
    default: { limit: SENSITIVE_THROTTLE_LIMIT, ttl: THROTTLE_WINDOW_MS },
  })
  @ApiOperation({ summary: 'Reset password with token' })
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.auth.resetPassword(body);
  }
}

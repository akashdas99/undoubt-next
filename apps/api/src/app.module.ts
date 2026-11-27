import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { DrizzleModule } from '@nestjs/drizzle';
import { ThrottlerModule } from '@nestjs/throttler';
import {
  DB_POOL_MAX,
  THROTTLE_DEFAULT_LIMIT,
  THROTTLE_WINDOW_MS,
} from '@workspace/constants';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ZodValidationPipe } from 'nestjs-zod';
import { AnswersModule } from './answers/answers.module.js';
import { AuthModule } from './auth/auth.module.js';
import { HttpExceptionFilter } from './common/http-exception/http-exception.filter.js';
import { ProxyThrottlerGuard } from './common/throttler/proxy-throttler.guard.js';
import { EmailModule } from './email/email.module.js';
import { QuestionsModule } from './questions/questions.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzleModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        drizzle,
        connection: {
          connectionString: config.getOrThrow<string>('DATABASE_URI'),
          max: DB_POOL_MAX,
        },
      }),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: THROTTLE_WINDOW_MS,
        limit: THROTTLE_DEFAULT_LIMIT,
      },
    ]),
    EmailModule,
    AuthModule,
    QuestionsModule,
    AnswersModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ProxyThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}

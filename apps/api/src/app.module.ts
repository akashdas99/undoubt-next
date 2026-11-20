import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DrizzleModule } from '@nestjs/drizzle';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from './auth/auth.module.js';
import { HttpExceptionFilter } from './common/http-exception/http-exception.filter.js';
import { EmailModule } from './email/email.module.js';
import {
  DB_POOL_MAX,
  THROTTLE_DEFAULT_LIMIT,
  THROTTLE_WINDOW_MS,
} from '@workspace/constants';

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
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
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

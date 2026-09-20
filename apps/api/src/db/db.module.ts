import { Global, Module } from '@nestjs/common';
import { createPoolDb } from '@repo/db/client';
import { DRIZZLE } from './db.constants.js';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: () => {
        const uri = process.env.DATABASE_URI;
        if (!uri) {
          throw new Error('DATABASE_URI is not set');
        }
        return createPoolDb(uri);
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule {}

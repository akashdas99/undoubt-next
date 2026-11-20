import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import {
  internalServerErrorProblem,
  problemFromException,
} from '../api-error.js';
import { pgErrorOf } from '../db-error.js';

function loggableUnhandledException(exception: unknown): string {
  if (!(exception instanceof Error)) {
    return 'Unknown exception';
  }
  const pgCode = pgErrorOf(exception)?.code;
  return pgCode ? `${exception.name} (pg:${pgCode})` : exception.name;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = problemFromException(status, exception.getResponse());
      response.status(status).type('application/problem+json').send(body);
      return;
    }

    this.logger.error(loggableUnhandledException(exception));

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .type('application/problem+json')
      .send(internalServerErrorProblem());
  }
}

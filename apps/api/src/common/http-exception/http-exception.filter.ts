import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  errorBodyFromHttpException,
  internalServerErrorBody,
} from '../api-error.js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = errorBodyFromHttpException(exception.getResponse());
      response.status(status).json(body);
      return;
    }

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(internalServerErrorBody());
  }
}

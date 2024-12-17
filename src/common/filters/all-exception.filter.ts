import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { isString } from 'lodash';
import { EntityNotFoundError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') {
      Logger.error(exception, (exception as any).stack, AllExceptionsFilter.name);
      throw exception;
    }

    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    if (
      !(exception instanceof ForbiddenException) &&
      !(exception instanceof UnauthorizedException) &&
      !(exception instanceof NotFoundException)
    ) {
      Logger.error(exception, (exception as any).stack, AllExceptionsFilter.name);
    }

    let statusCode = 500;
    let response = null;
    if (exception instanceof HttpException) {
      response = exception.getResponse() as {
        key: string;
        args: Record<string, unknown>;
      };
      statusCode = exception.getStatus();
    } else if (exception instanceof EntityNotFoundError) {
      response = {
        error: 'Not found',
        message: 'Not found',
      };
      statusCode = 404;
    } else {
      response = {
        error: 'Internal server error',
        message: (exception as any).message,
        _exception: exception,
      };
      statusCode = (exception as any).statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    }

    if (response['error'] == null && isString(response['message'])) {
      response['error'] = response['message'];
    }

    httpAdapter.reply(
      ctx.getResponse(),
      {
        statusCode,
        error: 'Internal server error',
        ...response,
      },
      statusCode
    );
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';

export class ApplicationException extends HttpException {
  constructor(statusCode: HttpStatus, description: string, objectOrError?: string | object | any) {
    super(
      HttpException.createBody(objectOrError ?? { message: description }, description, statusCode),
      statusCode
    );
  }
}

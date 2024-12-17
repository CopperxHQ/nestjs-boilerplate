export class ErrorDto {
  /**
   * Error payload property
   */
  message?: string | object | Array<string | object>;

  statusCode: number;

  error: string;

  constructor(error = 'Internal server error', statusCode = 500, message?: any) {
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
  }
}

export class SuccessDto {
  message: string;
  statusCode: number;

  constructor(message = 'Ok', statusCode = 200) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

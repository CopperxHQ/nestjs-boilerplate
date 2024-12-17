import { Controller, Get, Logger } from '@nestjs/common';
import { SuccessDto } from './common/dto';

/**
 * Handles the hello HTTP request and response.
 *
 * This controller is responsible for managing the hello operation.
 */
@Controller('')
export class AppController {
  /**
   * Returns a hello message.
   *
   * This endpoint returns a hello message.
   *
   * @returns A hello message.
   * @throws {500} Internal Server Error if the hello message cannot be returned.
   */
  @Get()
  async getHello(): Promise<SuccessDto> {
    Logger.debug('Hello World');

    return new SuccessDto('Hello World');
  }
}

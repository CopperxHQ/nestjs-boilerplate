import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

/**
 * Controller responsible for handling health check requests.
 * Provides a single endpoint to verify the application's health status.
 */
@Controller('healthcheck')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator
  ) {}

  /**
   * Endpoint to perform a health check on the application.
   * @returns {Promise<any>} A promise that resolves to the health check result.
   */
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([async () => this.db.pingCheck('typeorm')]);
  }
}

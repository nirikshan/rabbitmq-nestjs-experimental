import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  getAnalytics() {
    return this.analyticsService.getAnalytics();
  }

  @Get('health')
  healthCheck() {
    return { status: 'OK', service: 'analytics-service' };
  }
}
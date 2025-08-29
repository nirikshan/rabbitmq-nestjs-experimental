import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class AnalyticsService implements OnModuleInit {
  private analyticsData: any[] = [];

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit() {
    try {
      // Create analytics stream
      await this.rabbitMQService.createQueue('analytics.stream');
      
      // Bind to multiple streams
      await this.rabbitMQService.createExchange('orders.exchange', 'fanout');
      await this.rabbitMQService.createExchange('notifications.exchange', 'fanout');
      
      await this.rabbitMQService.bindQueue('analytics.stream', 'orders.exchange', '');
      await this.rabbitMQService.bindQueue('analytics.stream', 'notifications.exchange', '');
      
      // Process analytics stream
      await this.rabbitMQService.consumeQueue('analytics.stream', this.processAnalytics.bind(this));
      
      console.log('Analytics service initialized and listening');
    } catch (error) {
      console.error('Failed to initialize analytics service:', error);
    }
  }

  async processAnalytics(event: any) {
    console.log('Processing analytics event:', event.type);
    this.analyticsData.push({
      ...event,
      processedAt: new Date()
    });
    
    // Real-time analytics processing
    if (event.type === 'ORDER_STREAM') {
      this.processOrderAnalytics(event);
    } else if (event.type === 'NOTIFICATION_STREAM') {
      this.processNotificationAnalytics(event);
    }
  }

  private processOrderAnalytics(orderEvent: any) {
    console.log('Order analytics processed:', orderEvent.data.id);
    // Real-time order analytics
  }

  private processNotificationAnalytics(notificationEvent: any) {
    console.log('Notification analytics processed:', notificationEvent.data.type);
    // Real-time notification analytics
  }

  getAnalytics() {
    return {
      totalEvents: this.analyticsData.length,
      orderEvents: this.analyticsData.filter(e => e.type.includes('ORDER')).length,
      notificationEvents: this.analyticsData.filter(e => e.type.includes('NOTIFICATION')).length,
      events: this.analyticsData
    };
  }
}
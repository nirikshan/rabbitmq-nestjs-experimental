import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit() {
    try {
      // Create notification queues
      await this.rabbitMQService.createQueue('notifications.queue');
      await this.rabbitMQService.createQueue('notifications.stream');
      
      // Create exchanges
      await this.rabbitMQService.createExchange('orders.exchange', 'fanout');
      await this.rabbitMQService.createExchange('notifications.exchange', 'fanout');
      
      // Bind to order stream
      await this.rabbitMQService.bindQueue('notifications.stream', 'orders.exchange', '');
      
      // Consume notifications
      await this.rabbitMQService.consumeQueue('notifications.queue', this.sendNotification.bind(this));
      await this.rabbitMQService.consumeQueue('notifications.stream', this.broadcastNotification.bind(this));
      
      console.log('Notification service initialized and listening');
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
    }
  }

  async sendNotification(notification: any) {
    console.log('Sending notification for:', notification.data.id);
    // Simulate sending email/SMS
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Notification sent successfully for:', notification.data.id);
  }

  async broadcastNotification(orderEvent: any) {
    console.log('Broadcasting real-time notification for order:', orderEvent.data.id);
    // Real-time WebSocket broadcast would happen here
  }

  async createNotification(notificationData: any) {
    // For reliable delivery
    await this.rabbitMQService.publishToQueue('notifications.queue', {
      type: 'NOTIFICATION',
      data: notificationData,
      timestamp: new Date()
    });

    // For real-time streaming
    await this.rabbitMQService.publishToExchange('notifications.exchange', '', {
      type: 'NOTIFICATION_STREAM',
      data: notificationData,
      timestamp: new Date()
    });
  }
}
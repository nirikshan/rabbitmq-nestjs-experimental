import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class OrderService implements OnModuleInit {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit() {
    try {
      // Create queues
      await this.rabbitMQService.createQueue('orders.queue');
      await this.rabbitMQService.createQueue('orders.stream');
      
      // Create exchange for streams
      await this.rabbitMQService.createExchange('orders.exchange', 'fanout');
      await this.rabbitMQService.bindQueue('orders.stream', 'orders.exchange', '');
      
      // Start consuming orders
      await this.rabbitMQService.consumeQueue('orders.queue', this.processOrder.bind(this));
      console.log('Order service initialized and listening for orders');
    } catch (error) {
      console.error('Failed to initialize order service:', error);
    }
  }

  async createOrder(orderData: any) {
    const order = { 
      id: Math.random().toString(36).substr(2, 9), 
      ...orderData,
      createdAt: new Date()
    };

    // Publish to queue (reliable processing)
    await this.rabbitMQService.publishToQueue('orders.queue', {
      type: 'ORDER_CREATED',
      data: order,
      timestamp: new Date()
    });

    // Publish to stream (real-time broadcasting)
    await this.rabbitMQService.publishToExchange('orders.exchange', '', {
      type: 'ORDER_STREAM',
      data: order,
      timestamp: new Date()
    });

    return order;
  }

  private async processOrder(order: any) {
    console.log('Processing order:', order.data.id);
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Order processed successfully:', order.data.id);
  }
}
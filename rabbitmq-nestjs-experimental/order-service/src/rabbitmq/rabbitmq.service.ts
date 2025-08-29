import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    try {
      this.connection = await amqp.connect('amqp://admin:admin123@localhost:5672');
      this.channel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }

  async createQueue(queueName: string, options: amqp.Options.AssertQueue = { durable: true }) {
    return this.channel.assertQueue(queueName, options);
  }

  async createExchange(exchange: string, type: string, options: amqp.Options.AssertExchange = { durable: true }) {
    return this.channel.assertExchange(exchange, type, options);
  }

  async bindQueue(queue: string, exchange: string, routingKey: string) {
    return this.channel.bindQueue(queue, exchange, routingKey);
  }

  async publishToQueue(queue: string, content: any) {
    const message = Buffer.from(JSON.stringify(content));
    return this.channel.sendToQueue(queue, message, { persistent: true });
  }

  async publishToExchange(exchange: string, routingKey: string, content: any) {
    const message = Buffer.from(JSON.stringify(content));
    return this.channel.publish(exchange, routingKey, message, { persistent: true });
  }

  async consumeQueue(queue: string, callback: (msg: any) => void) {
    await this.channel.consume(queue, (message) => {
      if (message !== null) {
        const content = JSON.parse(message.content.toString());
        callback(content);
        this.channel.ack(message);
      }
    });
  }
}
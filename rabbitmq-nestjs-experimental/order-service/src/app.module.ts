import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [OrderModule, RabbitMQModule],
})
export class AppModule {}
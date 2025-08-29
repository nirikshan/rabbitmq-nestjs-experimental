import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule],
  providers: [NotificationService],
})
export class NotificationModule {}
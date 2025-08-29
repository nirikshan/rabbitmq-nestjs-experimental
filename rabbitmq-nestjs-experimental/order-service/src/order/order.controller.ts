import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() orderData: any) {
    return this.orderService.createOrder(orderData);
  }

  @Get('health')
  healthCheck() {
    return { status: 'OK', service: 'order-service' };
  }
}
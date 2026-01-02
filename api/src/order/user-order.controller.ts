import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from '~/order/dto/create-order';
import { JwtAuthGuard } from '~/guard/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class UserOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  create(@Request() req, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(req, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.orderService.getOrderByIdForUser(+id, req);
  }

  @Get()
  findAll(@Request() req) {
    return this.orderService.getAllOrdersForUser(req);
  }
}

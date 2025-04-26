import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '~/guard/jwt.guard';
import { RolesGuard } from '~/common/guards/roles.guard';
import { Role } from '~/common/enums/role.enum';
import { Roles } from '~/common/decorators/roles.decorator';
import { UpdateOrderStatusDto } from '~/order/dto/update-order';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/order')
export class AdminOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll() {
    return this.orderService.getAllOrdersForAdmin();
  }

  @Put(':id/status')
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateOrder(id, dto);
  }
}

import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderEntity } from '~/entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '~/entities/product.entity';
import { UserEntity } from '~/entities/user.entity';
import { OrderItemEntity } from '~/entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, ProductEntity, UserEntity, OrderItemEntity])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

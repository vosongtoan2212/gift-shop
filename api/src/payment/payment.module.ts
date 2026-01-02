import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { OrderEntity } from '~/entities/order.entity';
import { PaymentEntity } from '~/entities/payment.entity';
import { ProductEntity } from '~/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, PaymentEntity, ProductEntity]),
    ConfigModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}

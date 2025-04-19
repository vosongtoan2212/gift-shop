import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from '~/entities/review.entity';
import { ProductService } from '~/product/product.service';
import { ProductEntity } from '~/entities/product.entity';
import { UserEntity } from '~/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, ProductEntity, UserEntity])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}

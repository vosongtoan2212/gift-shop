import { Module } from '@nestjs/common';
import { UserProductController } from './user-product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '~/entities/product.entity';
import { JwtService } from '@nestjs/jwt';
import { AdminProductController } from '~/product/admin-product.controller';
import { CategoryEntity } from '~/entities/category.entity';
import { BrandEntity } from '~/entities/brand.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity, BrandEntity]),
  ],
  providers: [ProductService, JwtService],
  controllers: [UserProductController, AdminProductController],
  exports: [ProductService],
})
export class ProductModule {}

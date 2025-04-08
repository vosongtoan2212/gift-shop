import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '~/entities/product.entity';
import { CreateProductDTO } from '~/product/dto/create-product.dto';
import { UpdateProductDto } from '~/product/dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async create(createProductDto: CreateProductDTO): Promise<ProductEntity> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find({ relations: ['category', 'Product'] });
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'Product'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // Cập nhật sản phẩm
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const Product = await this.findOne(id); // Tìm sản phẩm để kiểm tra sự tồn tại
    Object.assign(Product, updateProductDto); // Cập nhật thông tin sản phẩm
    return this.productRepository.save(Product);
  }

  // Xóa sản phẩm
  async remove(id: number): Promise<void> {
    const Product = await this.findOne(id); // Kiểm tra sự tồn tại của sản phẩm
    await this.productRepository.remove(Product); // Xóa sản phẩm
  }
}

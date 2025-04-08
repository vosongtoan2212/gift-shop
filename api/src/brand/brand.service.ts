import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandEntity } from '~/entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly BrandRepository: Repository<BrandEntity>,
  ) {}

  // Tạo mới danh mục
  async create(createBrandDto: CreateBrandDto): Promise<BrandEntity> {
    const Brand = this.BrandRepository.create(createBrandDto);
    return this.BrandRepository.save(Brand);
  }

  // Lấy tất cả danh mục
  async findAll(): Promise<BrandEntity[]> {
    return this.BrandRepository.find();
  }

  // Lấy danh mục theo ID
  async findOne(id: number): Promise<BrandEntity> {
    const Brand = await this.BrandRepository.findOne({ where: { id } });
    if (!Brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return Brand;
  }

  // Cập nhật danh mục
  async update(
    id: number,
    updateBrandDto: UpdateBrandDto,
  ): Promise<BrandEntity> {
    const Brand = await this.findOne(id); // Tìm danh mục để kiểm tra sự tồn tại
    Object.assign(Brand, updateBrandDto); // Cập nhật thông tin danh mục
    return this.BrandRepository.save(Brand);
  }

  // Xóa danh mục
  async remove(id: number): Promise<void> {
    const Brand = await this.findOne(id); // Kiểm tra sự tồn tại của danh mục
    await this.BrandRepository.remove(Brand); // Xóa danh mục
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from '~/entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  // Tạo mới danh mục
  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  // Lấy tất cả danh mục
  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find();
  }

  // Lấy danh mục theo ID
  async findOne(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  // Cập nhật danh mục
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.findOne(id); // Tìm danh mục để kiểm tra sự tồn tại
    Object.assign(category, updateCategoryDto); // Cập nhật thông tin danh mục
    return this.categoryRepository.save(category);
  }

  // Xóa danh mục
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id); // Kiểm tra sự tồn tại của danh mục
    await this.categoryRepository.remove(category); // Xóa danh mục
  }
}

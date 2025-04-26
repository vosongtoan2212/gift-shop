import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { IsNull, Repository } from 'typeorm';
import { BrandEntity } from '~/entities/brand.entity';
import { CategoryEntity } from '~/entities/category.entity';
import { ProductEntity } from '~/entities/product.entity';
import { ReviewEntity } from '~/entities/review.entity';
import { CreateProductDTO } from '~/product/dto/create-product.dto';
import { SearchProductDto } from '~/product/dto/search-product.dto';
import { UpdateProductDto } from '~/product/dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(BrandEntity)
    private brandRepository: Repository<BrandEntity>,
  ) {}

  async create(createProductDto: CreateProductDTO): Promise<ProductEntity> {
    const baseSlug = slugify(createProductDto.name, {
      lower: true,
      strict: true,
    });
    let slug = baseSlug;
    let count = 1;

    while (await this.productRepository.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const product = this.productRepository.create({
      ...createProductDto,
      slug,
    });

    return this.productRepository.save(product);
  }

  async findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find({
      relations: ['category', 'brand'],
      order: {
        id: 'ASC', // Sắp xếp tăng dần theo ID
      },
    });
  }

  async findAllWithDeleted(): Promise<ProductEntity[]> {
    return this.productRepository.find({
      relations: ['category', 'brand'],
      order: {
        id: 'ASC', // Sắp xếp tăng dần theo ID
      },
      where: { deletedAt: IsNull() },
    });
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['category', 'brand'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findBySlug(slug: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['category', 'brand'],
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
    const product = await this.findOne(id); // Kiểm tra sản phẩm có tồn tại

    // Kiểm tra và cập nhật category nếu có
    if (updateProductDto.categoryId !== undefined) {
      const category = await this.categoryRepository.findOneBy({
        id: updateProductDto.categoryId,
      });
      if (!category) {
        throw new NotFoundException(
          `Danh mục với ID ${updateProductDto.categoryId} không tồn tại`,
        );
      }
      product.category = category;
    }

    // Kiểm tra và cập nhật brand nếu có
    if (updateProductDto.brandId !== undefined) {
      const brand = await this.brandRepository.findOneBy({
        id: updateProductDto.brandId,
      });
      if (!brand) {
        throw new NotFoundException(
          `Thương hiệu với ID ${updateProductDto.brandId} không tồn tại`,
        );
      }
      product.brand = brand;
    }

    // Cập nhật các trường còn lại
    Object.assign(product, updateProductDto);

    return this.productRepository.save(product);
  }

  // Xóa sản phẩm
  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Sản phẩm với ID ${id} không tồn tại`);
    }

    await this.productRepository.softDelete(id);
  }

  async search(query: SearchProductDto) {
    const {
      page = 1,
      limit = 10,
      categoryId,
      brandId,
      keyword,
      minPrice,
      maxPrice,
      slug,
    } = query;
    const skip = (page - 1) * limit;

    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .andWhere('product.deletedAt IS NULL')
      .leftJoin(
        (qb) =>
          qb
            .select('review.productId', 'productId')
            .addSelect('AVG(review.rating)', 'averageRating')
            .addSelect('COUNT(review.id)', 'reviewCount')
            .from(ReviewEntity, 'review')
            .groupBy('review.productId'),
        'review_summary',
        'review_summary.productId = product.id',
      )
      .addSelect('COALESCE(review_summary.averageRating, 0)', 'averageRating')
      .addSelect('COALESCE(review_summary.reviewCount, 0)', 'reviewCount');

    if (categoryId) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (brandId) {
      qb.andWhere('product.brandId = :brandId', { brandId });
    }

    if (slug) {
      qb.andWhere('product.slug LIKE :slug', { slug });
    }

    if (keyword) {
      const words = keyword.trim().split(/\s+/); // tách từ
      for (const [i, word] of words.entries()) {
        qb.andWhere(
          `(product.name LIKE :kw${i} OR product.description LIKE :kw${i} OR brand.name LIKE :kw${i})`,
          { [`kw${i}`]: `%${word}%` },
        );
      }
    }

    if (minPrice) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    const countQb = qb.clone();
    const total = await countQb.getCount();

    const { entities, raw } = await qb
      .skip(skip)
      .take(limit)
      .getRawAndEntities();

    const data = entities.map((product, index) => {
      return {
        ...product,
        averageRating: Number(raw[index]?.averageRating ?? 0),
        reviewCount: Number(raw[index]?.reviewCount ?? 0),
      };
    });

    return {
      data,
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }
}

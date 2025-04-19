import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';
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
    return this.productRepository.find({ relations: ['category', 'brand'] });
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
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
    const Product = await this.findOne(id); // Tìm sản phẩm để kiểm tra sự tồn tại
    Object.assign(Product, updateProductDto); // Cập nhật thông tin sản phẩm
    return this.productRepository.save(Product);
  }

  // Xóa sản phẩm
  async remove(id: number): Promise<void> {
    const Product = await this.findOne(id); // Kiểm tra sự tồn tại của sản phẩm
    await this.productRepository.remove(Product); // Xóa sản phẩm
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
      qb.andWhere('product.name LIKE :keyword', { keyword: `%${keyword}%` });
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

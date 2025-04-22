import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewEntity } from '~/entities/review.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '~/entities/product.entity';
import { UserEntity } from '~/entities/user.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(payloadToken: any, createReviewDto: CreateReviewDto) {
    const userId = payloadToken.sub;
    const productId = createReviewDto.productId;
    const content = createReviewDto.content;
    const rating = createReviewDto.rating;

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'fullname', 'profilePictureURL'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newReview = this.reviewRepository.create({
      user,
      product,
      content,
      rating,
    });

    const saved = await this.reviewRepository.save(newReview);

    return {
      id: saved.id,
      content: saved.content,
      rating: saved.rating,
      createdAt: saved.createdAt,
      user,
    };
  }

  async findByProductId(productId: number) {
    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoin('review.user', 'user')
      .leftJoin('review.product', 'product')
      .where('product.id = :productId', { productId })
      .select([
        'review.id',
        'review.content',
        'review.rating',
        'review.createdAt',
        'user.id',
        'user.email',
        'user.fullname',
        'user.profilePictureURL',
      ])
      .orderBy('review.createdAt', 'DESC')
      .getMany();
  }
}

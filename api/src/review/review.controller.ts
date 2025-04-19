import { Controller, Post, Body, Request, UseGuards, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '~/guard/jwt.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(req.user, createReviewDto);
  }

  @Get(':productId')
  findOne(@Param('productId', ParseIntPipe) productId: string) {
    return this.reviewService.findByProductId(+productId);
  }
}

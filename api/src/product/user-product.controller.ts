import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { SearchProductDto } from '~/product/dto/search-product.dto';
import { ProductService } from '~/product/product.service';

@Controller('product')
export class UserProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAllWithDeleted();
  }

  @Get('search')
  async search(@Query() query: SearchProductDto) {
    return this.productService.search(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.productService.findOne(+id);
  }
}

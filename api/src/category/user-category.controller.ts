import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class UserCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.categoryService.findOne(+id);
  }
}

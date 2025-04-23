import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '~/common/decorators/roles.decorator';
import { Role } from '~/common/enums/role.enum';
import { RolesGuard } from '~/common/guards/roles.guard';
import { JwtAuthGuard } from '~/guard/jwt.guard';
import { CreateProductDTO } from '~/product/dto/create-product.dto';
import { SearchProductDto } from '~/product/dto/search-product.dto';
import { UpdateProductDto } from '~/product/dto/update-product.dto';
import { ProductService } from '~/product/product.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/product')
export class AdminProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Post('create')
  async create(@Body() createProductDto: CreateProductDTO) {
    return this.productService.create(createProductDto);
  }

  @Get('search')
  async search(@Query() query: SearchProductDto) {
    return this.productService.search(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productService.remove(id);
    return { message: `Đã xóa sản phẩm có ID ${id}` };
  }
}

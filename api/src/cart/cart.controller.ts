import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '~/guard/jwt.guard';
import { CartEntity } from '~/entities/cart.entity';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Request() req, @Body() createCartDto: CreateCartDto) {
    return this.cartService.create(req.user, createCartDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.cartService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.cartService.findOne(+id);
  }

  @Put(':id')
  async updateCart(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<CartEntity> {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.cartService.remove(+id);
  }
}

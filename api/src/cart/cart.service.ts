import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartEntity } from '~/entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  async create(
    payloadToken: any,
    createCartDto: CreateCartDto,
  ): Promise<CartEntity> {
    const newCart = this.cartRepository.create({
      user: { id: payloadToken.sub },
      product: { id: createCartDto.productId },
      quantity: createCartDto.quantity,
    });
    return this.cartRepository.save(newCart);
  }

  async findAll(payloadToken: any): Promise<CartEntity[]> {
    const userId = payloadToken.sub;
    const carts = await this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });

    if (!carts || carts.length === 0) {
      throw new NotFoundException(`Cart not found for user with ID ${userId}`);
    }

    return carts;
  }

  async findOne(id: number): Promise<CartEntity> {
    const Cart = await this.cartRepository.findOne({ where: { id } });
    if (!Cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return Cart;
  }

  // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
  async update(id: number, updateCartDto: UpdateCartDto): Promise<CartEntity> {
    const cart = await this.findOne(id); // Tìm giỏ hàng theo id
    cart.quantity = updateCartDto.quantity; // Cập nhật số lượng sản phẩm
    return this.cartRepository.save(cart); // Lưu lại giỏ hàng đã được cập nhật
  }

  // Hàm xóa sản phẩm khỏi giỏ hàng
  async remove(id: number): Promise<void> {
    const cart = await this.findOne(id); // Tìm giỏ hàng theo id
    await this.cartRepository.remove(cart); // Xóa sản phẩm trong giỏ hàng
  }
}

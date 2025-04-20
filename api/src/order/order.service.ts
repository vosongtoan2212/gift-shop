import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { OrderItemEntity } from '~/entities/order-item.entity';
import { OrderEntity } from '~/entities/order.entity';
import { ProductEntity } from '~/entities/product.entity';
import { UserEntity } from '~/entities/user.entity';
import { CreateOrderDto } from '~/order/dto/create-order';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,

    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepo: Repository<OrderItemEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async createOrder(payloadToken, dto: CreateOrderDto) {
    const user = await this.userRepo.findOneBy({ id: payloadToken.user.sub });
    if (!user) throw new Error('User not found');

    const totalAmount = dto.orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const order = this.orderRepo.create({
      user,
      totalAmount,
      status: 'pending',
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      note: dto.note || null,
    });

    const savedOrder = await this.orderRepo.save(order);

    const orderItems = dto.orderItems.map((item) =>
      this.orderItemRepo.create({
        order: savedOrder,
        product: { id: item.productId } as ProductEntity,
        quantity: item.quantity,
        price: item.price,
      }),
    );

    await this.orderItemRepo.save(orderItems);

    const fullOrder = await this.orderRepo.findOne({
      where: { id: savedOrder.id },
      relations: ['user', 'orderItems', 'orderItems.product'],
    });

    return instanceToPlain(fullOrder);
  }

  async getAllOrders(payloadToken) {
    const orders = await this.orderRepo.find({
      where: { user: { id: payloadToken.user.sub } },
      relations: ['user', 'orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
    return instanceToPlain(orders);
  }
}

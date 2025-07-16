import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrNotFound } from 'src/types/aliases';
import { OrderStatus } from 'src/enums/order-status.enum';
import { User } from 'src/users/entities/user.entity';
import { OrderItem } from './entities/order-items.entity';
import { Product } from 'src/products/entities/product.entity';
import { log } from 'console';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  private async getOrder(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Order is not Found!');
    return order;
  }

  private async getUser(id: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User is not Found!');
    return user;
  }

  private async getProduct(id: string) {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Product is not Found!');
    return product;
  }

  async findAll() {
    const orders = await this.orderRepo.find({
      relations: ['user', 'items', 'items.product'],
    });
    if (!orders.length) throw new NotFoundException('No Orders!');
    return orders;
  }

  async findByUserId(userId: string) {
    await this.getUser(userId);
    const orders = await this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'items', 'items.product'],
    });
    return orders;
  }

  async findOne(id: string): OrNotFound<Order> {
    return await this.getOrder(id);
  }

  async createOrder(input: CreateOrderInput, userId: string) {
    const user = await this.getUser(userId);
    const items: OrderItem[] = [];
    for (const item of input.items) {
      const product = await this.getProduct(item.productId);
      if (product.stock < item.quantity)
        throw new BadRequestException('Insufficient quantity');
      product.stock -= item.quantity;
      await this.productRepo.save(product);
      const orderItem = this.orderItemRepo.create({
        product,
        quantity: item.quantity,
      });

      items.push(orderItem);
    }
    if (!items.length) throw new Error('Order is Empty!');
    const order = this.orderRepo.create({
      user,
      items,
      payment: input.payment,
      address: input.address,
      totalPrice: +input.totalPrice.toFixed(2),
      status: OrderStatus.SHIPPED,
    });

    await this.orderRepo.save(order);
    return order;
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
  ): OrNotFound<Boolean> {
    await this.getOrder(id);
    await this.orderRepo.update(id, { status });
    return true;
  }

  async remove(id: string): OrNotFound<Boolean> {
    const order = await this.getOrder(id);
    for (const orderItem of order.items) {
      const currentProduct = await this.getProduct(orderItem.product.id);
      await this.productRepo.update(orderItem.product.id, {
        stock: currentProduct.stock + orderItem.quantity,
      });
    }
    await this.orderRepo.delete(id);
    return true;
  }
}

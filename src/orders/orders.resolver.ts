import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { OrderStatus } from 'src/enums/order-status.enum';
import { OrNotFound } from 'src/types/aliases';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}
  @UseGuards(AuthGuard)
  @Mutation(() => Order, { name: 'createOrder' })
  async createOrder(
    @Args('input', { type: () => CreateOrderInput }) input: CreateOrderInput,
    @CurrentUser() user: User,
  ) {
    return await this.ordersService.createOrder(input, user.id);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Order], { name: 'getByUserId' })
  async getByUserId(@Args('userId') userId: string) {
    return await this.ordersService.findByUserId(userId);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => [Order], { name: 'getOrders' })
  async findAll(): OrNotFound<Order[]> {
    return await this.ordersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Query(() => Order, { name: 'getOrder' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
  ): OrNotFound<Order> {
    return await this.ordersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async updateOrderStatus(
    @Args('id', { type: () => String }) id: string,
    @Args('status', { type: () => OrderStatus }) status: OrderStatus,
  ): OrNotFound<Boolean> {
    return await this.ordersService.updateOrderStatus(id, status);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  async removeOrder(
    @Args('id', { type: () => String }) id: string,
  ): OrNotFound<Boolean> {
    return await this.ordersService.remove(id);
  }
}

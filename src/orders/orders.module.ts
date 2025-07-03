import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderItem } from './entities/order-items.entity';

@Module({
  providers: [OrdersResolver, OrdersService],
  imports: [TypeOrmModule.forFeature([Order, User, Product, OrderItem])],
})
export class OrdersModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Order } from './orders/entities/order.entity';
import { Product } from './products/entities/product.entity';
import { AuthModule } from './auth/auth.module';
import { OrderItem } from './orders/entities/order-items.entity';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    OrdersModule,
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gpl',
      playground: true,
      sortSchema: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      autoLoadEntities: true,
      type: 'postgres',
      host: 'localhost',
      synchronize: true,
      entities: [User, Order, Product, OrderItem],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

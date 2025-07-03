import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity({ name: 'order-items' })
@ObjectType()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @Field(() => Order)
  order: Relation<Order>;

  @ManyToOne(() => Product)
  @Field(() => Product)
  product: Relation<Product>;

  @Column()
  @Field()
  quantity: number;

  @Column('decimal')
  @Field()
  price: number;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  @Field()
  updated_at: Date;
}

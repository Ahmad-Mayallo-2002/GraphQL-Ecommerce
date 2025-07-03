import { ObjectType, Field } from '@nestjs/graphql';
import { OrderStatus } from 'src/enums/order-status.enum';
import { Payment } from 'src/enums/payment.enum';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-items.entity';

@Entity({ name: 'orders' })
@ObjectType()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  address: string;

  @Column({ type: 'decimal', nullable: false, default: 0 })
  @Field()
  totalPrice: number;

  @Column({ type: 'enum', enum: Payment, nullable: false })
  @Field()
  payment: Payment;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    nullable: false,
    default: OrderStatus.PENDING,
  })
  @Field(() => OrderStatus)
  status: OrderStatus;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn()
  @Field(() => User)
  user: Relation<User>;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  @Field(() => [OrderItem])
  items: Relation<OrderItem[]>;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}

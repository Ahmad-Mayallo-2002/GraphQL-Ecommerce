import { ObjectType, Field } from '@nestjs/graphql';
import { Role } from 'src/enums/role.enum';
import { Order } from 'src/orders/entities/order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  @Field()
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  password: string;

  @Column({ type: 'enum', enum: Role, nullable: false, default: Role.USER })
  @Field(() => Role, { defaultValue: Role.USER })
  role: Role;

  @OneToMany(() => Order, (order) => order.user)
  @Field(() => [Order])
  orders: Relation<Order[]>;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}

import { Field, InputType } from '@nestjs/graphql';
import { OrderStatus } from 'src/enums/order-status.enum';
import { Payment } from 'src/enums/payment.enum';
import { CreateOrderItemInput } from './create-order-items.input';
import { IsEmpty, IsNotEmpty, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateOrderInput {
  @Field(() => [CreateOrderItemInput], { nullable: false })
  @IsEmpty()
  items: CreateOrderItemInput[];

  @IsNotEmpty()
  @IsString()
  @Field({ nullable: false })
  address: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => OrderStatus, { nullable: false })
  status: OrderStatus;

  @IsNotEmpty()
  @IsPositive()
  @IsPositive()
  @Field({ nullable: false, defaultValue: 0 })
  totalPrice: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => Payment, { nullable: false })
  payment: Payment;
}

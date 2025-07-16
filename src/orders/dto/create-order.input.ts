import { Field, Float, InputType } from '@nestjs/graphql';
import { OrderStatus } from 'src/enums/order-status.enum';
import { Payment } from 'src/enums/payment.enum';
import { CreateOrderItemInput } from './create-order-items.input';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateOrderInput {
  @Field(() => [CreateOrderItemInput], { nullable: false })
  items: CreateOrderItemInput[];

  @IsNotEmpty()
  @IsString()
  @Field({ nullable: false })
  address: string;

  @Field(() => OrderStatus, { nullable: true })
  status: OrderStatus;

  @IsNotEmpty()
  @IsPositive()
  @Field(() => Float, { nullable: false, defaultValue: 0 })
  totalPrice: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => Payment, { nullable: false })
  payment: Payment;
}

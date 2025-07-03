import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateOrderItemInput {
  @IsNotEmpty()
  @IsString()
  @Field()
  productId: string;

  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  @Field()
  quantity: number;
}

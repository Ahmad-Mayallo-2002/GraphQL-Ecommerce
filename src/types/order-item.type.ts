import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderItemType {
  @Field(() => String)
  productId: string;

  @Field(() => Int)
  quantity: number;
}

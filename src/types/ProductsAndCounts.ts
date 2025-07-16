import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/products/entities/product.entity';

@ObjectType()
export class ProductsAndCounts {
  @Field(() => [Product])
  products: Product[];

  @Field()
  counts: number;
}

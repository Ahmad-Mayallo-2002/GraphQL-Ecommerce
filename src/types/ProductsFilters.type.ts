import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class ProductsFilters {
  @Field(() => [String], { nullable: true, defaultValue: [] })
  color: string[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  category: string[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  brand: string[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  size: string[];
}

export interface TestInterface {
  color: string[];
  category: string[];
  size: string[];
  brand: string[];
}

export type Sort = 'ASC' | 'DESC';

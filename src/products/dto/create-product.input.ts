import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateProductInput {
  @IsNotEmpty()
  @IsString()
  @Field({ nullable: false })
  title: string;

  @IsNotEmpty()
  @IsString()
  @Field({ nullable: false })
  description: string;

  @IsNotEmpty()
  @IsString()
  @Field({ nullable: false })
  category: string;

  @IsNotEmpty()
  @IsString()
  @Field({ nullable: false, defaultValue: '' })
  image: string;

  @IsNotEmpty()
  @Field(() => Float, { nullable: false, defaultValue: 0 })
  price: number;

  @IsNotEmpty()
  @IsInt()
  @Field(() => Int, { nullable: false, defaultValue: 1 })
  stock: number;
}

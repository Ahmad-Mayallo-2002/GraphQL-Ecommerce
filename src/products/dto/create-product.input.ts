import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

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

  @IsString()
  @Field({ nullable: true, defaultValue: '' })
  image: string;

  @IsNotEmpty()
  @IsPositive()
  @Field(() => Float, { nullable: false })
  price: number;

  @IsPositive()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  discount: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Field(() => Int, { nullable: false })
  stock: number;

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: false })
  color: string;

  @IsString()
  @IsNotEmpty()
  @Field({ nullable: false })
  size: string;

  @IsNotEmpty()
  @IsString()
  @Field({ nullable: false })
  brand: string;
}

import { ObjectType, Field, Float } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'products' })
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  title: string;

  @Column({ type: 'text' })
  @Field()
  description: string;

  @Column({ type: 'text' })
  @Field()
  image: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  category: string;

  @Column({ type: 'decimal' })
  @Field()
  price: number;

  @Column({ type: 'int', default: 0 })
  @Field()
  stock: number;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  color: string;

  @Column({ type: 'varchar', length: 100 })
  @Field()
  size: string;

  @Column({ type: 'varchar', length: 255 })
  @Field()
  brand: string;

  @Column({ type: 'decimal', default: 0 })
  @Field(() => Float)
  discount: number;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}

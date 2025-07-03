import { ObjectType, Field } from '@nestjs/graphql';
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

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  title: string;

  @Column({ type: 'text', nullable: false })
  @Field()
  description: string;

  @Column({ type: 'text', nullable: false })
  @Field()
  image: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Field()
  category: string;

  @Column({ type: 'decimal', default: 0, nullable: false })
  @Field()
  price: number;

  @Column({ type: 'int', default: 0, nullable: false })
  @Field()
  stock: number;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updated_at: Date;
}

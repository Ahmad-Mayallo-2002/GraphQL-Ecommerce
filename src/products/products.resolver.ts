import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { OrNotFound } from 'src/types/aliases';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { ProductsAndCounts } from 'src/types/ProductsAndCounts';
import { log } from 'console';
import {
  ProductsFilters,
  Sort,
  type TestInterface,
} from 'src/types/ProductsFilters.type';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => ProductsAndCounts, {
    name: 'getProducts',
  })
  findAll(
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 })
    skip: number,
    @Args('sort', { type: () => String, nullable: true, defaultValue: '' })
    sort: string,
    @Args('take', { type: () => Int, nullable: true })
    take: number,
  ): OrNotFound<any> {
    return this.productsService.findAll(skip, take, sort);
  }

  @Query(() => Product, { name: 'getProduct' })
  findOne(@Args('id', { type: () => String }) id: string): OrNotFound<Product> {
    return this.productsService.findOne(id);
  }

  @Query(() => [Product], { name: 'filterProducts' })
  filterProducts(
    @Args('color', { type: () => [String] }) color: string[],
    @Args('category', { type: () => [String] }) category: string[],
    @Args('brand', { type: () => [String] }) brand: string[],
    @Args('size', { type: () => [String] }) size: string[],
  ) {
    return this.productsService.filterProducts(color, category, brand, size);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Product, { name: 'createProduct' })
  createProduct(
    @Args('input') input: CreateProductInput,
    @Args('image', { type: () => GraphQLUpload, nullable: false })
    image: FileUpload,
  ): OrNotFound<Product> {
    return this.productsService.create(input, image);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  updateProduct(
    @Args('input') input: UpdateProductInput,
    @Args('id', { type: () => String }) id: string,
    @Args('image', { type: () => GraphQLUpload, nullable: true })
    image: FileUpload,
  ): OrNotFound<Boolean> {
    return this.productsService.update(id, input, image);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Boolean, { name: 'deleteProduct' })
  removeProduct(
    @Args('id', { type: () => String }) id: string,
  ): OrNotFound<Boolean> {
    return this.productsService.remove(id);
  }
}

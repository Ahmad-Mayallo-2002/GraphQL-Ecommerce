import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { OrNotFound } from 'src/types/aliases';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CloudinaryService } from 'src/cloudinary.service';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Product, { name: 'createProduct' })
  createProduct(
    @Args('input') input: CreateProductInput,
    @Args('image', { type: () => GraphQLUpload }) image: FileUpload,
  ): OrNotFound<Product> {
    return this.productsService.create(input, image);
  }

  @Query(() => [Product], { name: 'getProducts' })
  findAll(): OrNotFound<Product[]> {
    return this.productsService.findAll();
  }

  @Query(() => Product, { name: 'getProduct' })
  findOne(@Args('id', { type: () => String }) id: string): OrNotFound<Product> {
    return this.productsService.findOne(id);
  }

  @Query(() => [Product], { name: 'getProductsByCategory' })
  findProductsByCategory(@Args('category') category: string) {
    return this.productsService.findProductsByCategory(category);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  updateProduct(
    @Args('input') input: UpdateProductInput,
    @Args('id', { type: () => String }) id: string,
  ): OrNotFound<Boolean> {
    return this.productsService.update(id, input);
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

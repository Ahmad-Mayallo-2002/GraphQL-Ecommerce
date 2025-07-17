import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductInput } from './dto/update-product.input';
import { OrNotFound } from 'src/types/aliases';
import { CloudinaryService } from 'src/cloudinary.service';
import { FileUpload } from 'graphql-upload-ts';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async getProduct(id: string): OrNotFound<Product> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new NotFoundException('Product is not found!');
    return product;
  }

  private async getImageSecureUrl(image: FileUpload) {
    const { createReadStream, filename, mimetype } = image;
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      createReadStream()
        .on('data', (chunk) => chunks.push(chunk))
        .on('end', () => resolve(Buffer.concat(chunks)))
        .on('error', reject);
    });
    const imageUrl = await this.cloudinaryService.uploadFile({
      buffer,
      originalname: filename,
      mimetype,
    } as Express.Multer.File);
    return imageUrl;
  }

  async findAll(skip: number, take: number, sort: string): OrNotFound<any> {
    let orderBy = {};
    switch (sort) {
      case 'ASC':
        orderBy = { price: 'ASC' };
        break;
      case 'DESC':
        orderBy = { price: 'DESC' };
        break;
    }
    const products = await this.productRepo.find({
      skip,
      order: orderBy,
      take,
    });

    const counts = await this.productRepo.count();
    if (!products.length) throw new NotFoundException('No Products!');

    return { products, counts };
  }

  async findOne(id: string): OrNotFound<Product> {
    return await this.getProduct(id);
  }

  async filterProducts(
    color: string[],
    category: string[],
    brand: string[],
    size: string[],
  ): OrNotFound<Product[]> {
    const products = await this.productRepo
      .createQueryBuilder('product')
      .where('product.color IN (:...color)', { color })
      .orWhere('product.category IN (:...category)', { category })
      .orWhere('product.brand IN (:...brand)', { brand })
      .orWhere('product.size IN (:...size)', { size })
      .orderBy({ price: 'ASC' })
      .getMany();
    return products;
  }

  async create(
    input: CreateProductInput,
    image: FileUpload,
  ): OrNotFound<Product> {
    const imageUrl = await this.getImageSecureUrl(image);
    const product = this.productRepo.create({ ...input, image: imageUrl });
    return await this.productRepo.save(product);
  }

  async update(
    id: string,
    input: UpdateProductInput,
    image?: FileUpload,
  ): OrNotFound<Boolean> {
    const existing = (await this.getProduct(id)) as Product;
    if (!image && !input) return false;
    if (image) {
      const imageUrl = await this.getImageSecureUrl(image);
      input.image = imageUrl;
    } else {
      input.image = existing.image;
    }
    const result = this.productRepo.merge(existing, input);
    await this.productRepo.save(result);
    return true;
  }

  async remove(id: string): OrNotFound<Boolean> {
    await this.getProduct(id);
    await this.productRepo.delete(id);
    return true;
  }
}

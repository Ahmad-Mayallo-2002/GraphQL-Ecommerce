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

  async create(input: CreateProductInput, image: FileUpload): OrNotFound<Product> {
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
      mimetype
    } as Express.Multer.File);
    const product = this.productRepo.create({...input, image: imageUrl});
    return await this.productRepo.save(product);;
  }

  async findAll(): OrNotFound<Product[]> {
    const products = await this.productRepo.find();
    if (!products.length) return new NotFoundException('No Products!');
    return products;
  }

  async findOne(id: string): OrNotFound<Product> {
    return await this.getProduct(id);
  }

  async findProductsByCategory(category: string): OrNotFound<Product[]> {
    const products = await this.productRepo.findBy({ category });
    if (!products.length) return new NotFoundException('No Products!');
    return products;
  }

  async update(id: string, input: UpdateProductInput): OrNotFound<Boolean> {
    await this.getProduct(id);
    await this.productRepo.update(id, input as any);
    return true;
  }

  async remove(id: string): OrNotFound<Boolean> {
    await this.getProduct(id);
    await this.productRepo.delete(id);
    return true;
  }
}

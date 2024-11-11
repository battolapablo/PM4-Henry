import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { productsEntity } from '../products/entities/product.entity';
import { fileEntity } from './entities/file.entity';

@Injectable()
export class FilesRepository {
  constructor(
    @InjectRepository(fileEntity)
    private fileRepository: Repository<fileEntity>,
    @InjectRepository(productsEntity)
    private productsRepository: Repository<productsEntity>,
  ) {}

  async uploadImage(productId: string, file: Express.Multer.File) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    try {
      const result = await cloudinary.uploader.upload(file.path);
      if (!result) {
        throw new BadRequestException('Failed to upload image to Cloudinary');
      }
      const newFile = new fileEntity();
      newFile.name = file.originalname;
      newFile.mimeType = file.mimetype;
      newFile.product = product;
      newFile.data = Buffer.from(result.secure_url);
      await this.fileRepository.save(newFile);

      product.imgUrl = result.secure_url;
      await this.productsRepository.save(product);

      return await {
        message: 'Image uploaded successfully',
        url: result.secure_url,
        mimeType: newFile.mimeType,
        data: newFile.data,
        product: newFile.product,
      };
    } catch (error) {
      throw new BadRequestException('Failed to save file data to database');
    }
  }
}

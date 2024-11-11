import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { fileEntity } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(fileEntity)
    private readonly fileRepository: Repository<fileEntity>,
  ) {}

  async saveFile(file: fileEntity): Promise<fileEntity> {
    return this.fileRepository.save(file);
  }

  async findFilesByProductId(productId: string): Promise<fileEntity[]> {
    return this.fileRepository.find({
      where: { product: { id: productId } },
    });
  }
}

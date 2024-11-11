import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { productsEntity } from '../products/entities/product.entity';
import { fileEntity } from './entities/file.entity';
import { FileService } from './files.service';
import { FilesRepository } from './files.repository';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forFeature([productsEntity, fileEntity]),
  ],
  controllers: [FilesController],
  providers: [FileService, FilesRepository],
  exports: [FilesRepository],
})
export class FilesModule {}

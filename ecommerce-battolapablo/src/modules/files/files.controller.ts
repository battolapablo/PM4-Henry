import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UsePipes,
} from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthHeaderGuard } from '../../Guards/authHeader.guard';
import { MinSizeValidatorPipe } from './pipes/min-size-validator.pipe';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../utils/roles.enum';

@Controller('files')
@ApiTags('Files')
export class FilesController {
  constructor(private readonly filesRepository: FilesRepository) {}

  @UseGuards(AuthHeaderGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @Post('uploadImage/:id')
  @ApiOperation({ summary: 'Upload Product Image **' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully',
    schema: {
      example: {
        message: 'Image uploaded successfully',
        url: 'https://res.cloudinary.com/do8qbhrut/image/upload/v1727066269/b1zw6xawcbqpomvlmel5.jpg',
        mimeType: 'image/jpeg',
        data: {
          type: 'Buffer',
          data: [
            104, 116, 116, 112, 115, 58, 47, 47, 114, 101, 115, 46, 99, 108,
            111, 117, 100, 105, 110, 97, 114, 121, 46, 99, 111, 109, 47, 100,
            111, 56, 113, 98, 104, 114, 117, 116, 47, 105, 109, 97, 103, 101,
            47, 117, 112, 108, 111, 97, 100, 47, 118, 49, 55, 50, 55, 48, 54,
            54, 50, 54, 57, 47, 98, 49, 122, 119, 54, 120, 97, 119, 99, 98, 113,
            112, 111, 109, 118, 108, 109, 101, 108, 53, 46, 106, 112, 103,
          ],
        },
        product: {
          id: '65dca486-48c3-41e7-814b-c9ffb9a48602',
          name: 'Samsung Odyssey G9',
          description: 'The best monitor in the world',
          price: '299.99',
          stock: 12,
          imgUrl:
            'https://res.cloudinary.com/do8qbhrut/image/upload/v1727066269/b1zw6xawcbqpomvlmel5.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error validating upload',
    schema: {
      example: {
        statusCode: 400,
        message: 'File must be less than 200kb',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product not found',
        error: 'Not Found',
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(MinSizeValidatorPipe)
  async uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: 'File must be less than 200kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.filesRepository.uploadImage(id, file);
  }
}

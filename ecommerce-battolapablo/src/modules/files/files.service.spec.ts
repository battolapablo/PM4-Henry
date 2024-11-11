import { Test } from '@nestjs/testing';
import { FileService } from './files.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { fileEntity } from './entities/file.entity';
import { productsEntity } from '../products/entities/product.entity';
import { FilesRepository } from './files.repository';
import * as cloudinary from 'cloudinary';
import { BadRequestException } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';

describe('FileService', () => {
  let fileService: FileService;
  let filesRepository: FilesRepository;
  let mockFileRepository: Partial<Repository<fileEntity>>;
  let mockProductRepository: Partial<Repository<productsEntity>>;

  const mockFile: fileEntity = {
    id: 'file-id-123',
    name: 'test-file.png',
    mimeType: 'image/png',
    product: { id: 'product-id-123' } as productsEntity,
    data: Buffer.from('test-data'),
  };

  const mockProduct: productsEntity = {
    id: 'product-id-123',
    name: 'Test Product',
    price: 100,
    stock: 10,
    imgUrl: 'some-image-url',
  } as productsEntity;

  beforeEach(async () => {
    mockFileRepository = {
      save: jest.fn().mockResolvedValue(mockFile),
      find: jest.fn().mockResolvedValue([mockFile]),
    };

    mockProductRepository = {
      findOne: jest.fn().mockResolvedValue(mockProduct),
      save: jest.fn().mockResolvedValue(mockProduct),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        FileService,
        FilesRepository,
        {
          provide: getRepositoryToken(fileEntity),
          useValue: mockFileRepository,
        },
        {
          provide: getRepositoryToken(productsEntity),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    fileService = moduleRef.get<FileService>(FileService);
    filesRepository = moduleRef.get<FilesRepository>(FilesRepository);
  });

  it('should be defined', () => {
    expect(fileService).toBeDefined();
    expect(filesRepository).toBeDefined();
  });

  it('saveFile () should save a file and return it', async () => {
    const savedFile = await fileService.saveFile(mockFile);
    expect(savedFile).toEqual(mockFile);
    expect(mockFileRepository.save).toHaveBeenCalledWith(mockFile);
  });

  it('findFilesByProductId () should return an array of files by product ID', async () => {
    const files = await fileService.findFilesByProductId('product-id-123');
    expect(files).toEqual([mockFile]);
    expect(mockFileRepository.find).toHaveBeenCalledWith({
      where: { product: { id: 'product-id-123' } },
    });
  });

  describe('uploadImage', () => {
    const mockMulterFile = {
      originalname: 'test.png',
      mimetype: 'image/png',
      path: 'test-path',
    } as Express.Multer.File;

    it('should upload an image and return the result', async () => {
      const mockCloudinaryResponse: UploadApiResponse = {
        secure_url: 'cloudinary-url',
        public_id: 'mock-public-id',
        version: 1234567890,
        signature: 'mock-signature',
        width: 800,
        height: 600,
        format: 'png',
        resource_type: 'image',
        created_at: '2023-01-01T00:00:00Z',
        context: {},
        metadata: {},
        access_control: [],
        tags: [],
        pages: 0,
        bytes: 0,
        type: '',
        etag: '',
        placeholder: false,
        url: '',
        access_mode: '',
        original_filename: '',
        moderation: [],
      };

      jest
        .spyOn(cloudinary.v2.uploader, 'upload')
        .mockResolvedValue(mockCloudinaryResponse);

      const result = await filesRepository.uploadImage(
        'product-id-123',
        mockMulterFile,
      );

      expect(result).toEqual({
        message: 'Image uploaded successfully',
        url: 'cloudinary-url',
        mimeType: mockMulterFile.mimetype,
        data: Buffer.from('cloudinary-url'),
        product: mockProduct,
      });

      expect(mockProductRepository.save).toHaveBeenCalled();
      expect(mockFileRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if the product is not found', async () => {
      mockProductRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        filesRepository.uploadImage('invalid-id', mockMulterFile),
      ).rejects.toThrow(BadRequestException);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid-id' },
      });
    });

    it('should throw an error if Cloudinary upload fails', async () => {
      jest;
      jest
        .spyOn(cloudinary.v2.uploader, 'upload')
        .mockRejectedValue(new Error('Upload failed'));

      await expect(
        filesRepository.uploadImage('product-id-123', mockMulterFile),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

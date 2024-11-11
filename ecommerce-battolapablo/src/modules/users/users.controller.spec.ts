import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let mockJwtService: JwtService;

  const mockUser = {
    id: '1',
    name: 'User 1',
    email: 'user1@example.com',
    password: 'hashed_password',
    isAdmin: false,
  };

  beforeEach(async () => {
    const mockUsersService = {
      findAll: jest.fn().mockResolvedValue([mockUser]),
      findOne: jest.fn().mockResolvedValue(mockUser),
      create: jest.fn().mockResolvedValue(mockUser),
      update: jest
        .fn()
        .mockResolvedValue({ ...mockUser, name: 'Updated User' }),
      remove: jest.fn().mockResolvedValue(mockUser),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('create() should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'New User',
      email: 'user1@example.com',
      password: 'password123',
      confirmPassword: '',
      address: '',
      phone: 0,
      country: '',
      city: '',
      isAdmin: false,
    };

    const result = await usersService.create(createUserDto);
    expect(result).toEqual(mockUser);
    expect(usersService.create).toHaveBeenCalledWith(createUserDto);
  });

  it('findAll() should return an array of users', async () => {
    const result = await usersController.findAll();
    expect(result).toEqual([mockUser]);
    expect(usersService.findAll).toHaveBeenCalled();
  });

  it('findOne() should return a user by ID', async () => {
    const result = await usersController.findOne('1');
    expect(result).toEqual(mockUser);
    expect(usersService.findOne).toHaveBeenCalledWith('1');
  });

  it('update() should update a user', async () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated User',
      email: 'updated@example.com',
    };

    const result = await usersController.update('1', updateUserDto);
    expect(result).toEqual({ ...mockUser, name: 'Updated User' });
    expect(usersService.update).toHaveBeenCalledWith('1', updateUserDto);
  });
});

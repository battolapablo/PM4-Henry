import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { usersEntity } from './entities/user.entity';

describe('UsersService', () => {
  let usersService: UsersService;
  let mockUsersRepository: Partial<UsersRepository>;

  const mockUser: Omit<usersEntity, 'password' | 'confirmPassword'> = {
    id: '1',
    name: 'User 1',
    email: 'user1@example.com',
    isAdmin: false,
    phone: 0,
    country: '',
    address: '',
    city: '',
    orders: [],
  };

  beforeEach(async () => {
    mockUsersRepository = {
      findAllUsers: jest.fn().mockResolvedValue([mockUser]),
      getUserById: jest.fn().mockResolvedValue(mockUser),
      createUser: jest.fn().mockResolvedValue(mockUser),
      updateUser: jest.fn().mockResolvedValue({
        ...mockUser,
        name: 'Updated User',
      }),
      deleteUser: jest.fn().mockResolvedValue(mockUser),
    };

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockUsersRepository },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('findAll() should return a list of users', async () => {
    const users = await usersService.findAll();
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);
    expect(users[0].name).toEqual(mockUser.name);
  });

  it('findOne() should return a user by id', async () => {
    const user = await usersService.findOne('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual('1');
  });

  it('update() should update a user by id', async () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated User',
      email: 'updated@example.com',
    };

    const updatedUser = await usersService.update('1', updateUserDto);
    expect(updatedUser).toBeDefined();
    expect(updatedUser.name).toEqual(updateUserDto.name);
  });

});

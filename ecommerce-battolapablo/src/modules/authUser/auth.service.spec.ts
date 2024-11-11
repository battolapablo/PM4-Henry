import { Test } from '@nestjs/testing';
import { AuthUserService } from './authUser.service';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { usersEntity } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

describe('authUserService', () => {
  let authUserService: AuthUserService;
  let mockUsersRepository: Partial<UsersRepository>;

  const mockUser: Omit<usersEntity, 'id' | 'orders'> = {
    name: 'Pablo',
    password: '12345aA!',
    email: 'pablo@gmail.com',
    confirmPassword: '12345aA!',
    phone: 12342345345,
    country: 'Argentina',
    address: 'Suquia 200',
    city: 'Cordoba',
    isAdmin: false,
  };

  beforeEach(async () => {
    mockUsersRepository = {
      getUserByEmail: (): Promise<usersEntity | null> => {
        return Promise.resolve(null);
      },
      createUser: (user: CreateUserDto): Promise<CreateUserDto> => {
        return Promise.resolve({
          ...user,
          isAdmin: false,
          id: '1234fs-234sd-24cs-fd-34sdfg',
        });
      },
    };

    const mockJwtService = {
      sign: (payload: string | object | Buffer) =>
        jwt.sign(payload, 'testSecret'),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthUserService,
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();
    authUserService = module.get<AuthUserService>(AuthUserService);
  });

  it('Create an instance of AuthService', async () => {
    expect(authUserService).toBeDefined();
  });
  it('signUp() creates a new user with an encripted password', async () => {
    const user = await authUserService.signUp(mockUser);
    expect(user).toBeDefined();
    expect(user.password).not.toEqual(mockUser.password);
  });
  it('signUp() Throws an error if the email is already in use', async () => {
    mockUsersRepository.getUserByEmail = (email: string) =>
      Promise.resolve(mockUser as usersEntity);
    try {
      await authUserService.signUp(mockUser as usersEntity);
    } catch (error) {
      expect((error as Error).message).toEqual('Email is already in use');
    }
  });
  it('signIn() returns an error if the password is invalid', async () => {
    mockUsersRepository.getUserByEmail = (email: string) =>
      Promise.resolve(mockUser as usersEntity);

    try {
      await authUserService.signIn(mockUser.email, 'INVALID PASSWORD');
    } catch (error) {
      expect((error as Error).message).toEqual('Invalid credentials');
    }
  });
  it('signIn returns an error if the user is not found', async () => {
    mockUsersRepository.getUserByEmail = (email: string) =>
      Promise.resolve(mockUser as usersEntity);
    try {
      await authUserService.signIn(mockUser.email, mockUser.password);
    } catch (error) {
      expect((error as Error).message).toEqual('Invalid credentials');
    }
  });
  it('signIn return an object with a message and a token if the user is found and password is authenticated ', async () => {
    const mockUserVariant = {
      ...mockUser,
      password: await bcrypt.hash(mockUser.password, 10),
    };
    mockUsersRepository.getUserByEmail = (email: string) =>
      Promise.resolve(mockUserVariant as usersEntity);
    const response = await authUserService.signIn(
      mockUser.email,
      mockUser.password,
    );
    expect(response).toBeDefined();
    expect(response.token).toBeDefined();
    expect(response.success).toEqual('User logged in successfully');
  });
});

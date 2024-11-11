import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { usersEntity } from '../users/entities/user.entity';
import { UsersRepository } from '../users/users.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { Role } from '../../utils/roles.enum';

@Injectable()
export class AuthUserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(userData: CreateUserDto) {
    const { password, confirmPassword, ...restUserData } = userData;

    if (password.trim() !== confirmPassword.trim()) {
      throw new BadRequestException('Passwords do not match');
    }

    const dbUser: usersEntity | null =
      await this.usersRepository.getUserByEmail(userData.email);
    if (dbUser) {
      throw new BadRequestException('Email is already in use');
    }

    const hashedPassword = await bcryptjs.hash(userData.password, 10);
    if (!hashedPassword) {
      throw new Error('Password hashing failed');
    }

    const newUser = await this.usersRepository.createUser({
      ...restUserData,
      password: hashedPassword,
      confirmPassword: '',
    });
    return newUser;
  }

  async signIn(email: string, password: string) {
    const dbUser = await this.usersRepository.getUserByEmail(email);
    if (!dbUser) {
      throw new BadRequestException('Invalid credentials');
    }
    const isPasswordValid = await bcryptjs.compare(password, dbUser.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const userPayload = {
      sub: dbUser.id,
      id: dbUser.id,
      roles: [dbUser.isAdmin ? Role.Admin : Role.User],
    };

    const token = this.jwtService.sign(userPayload);
    return { success: 'User logged in successfully', token };
  }
}

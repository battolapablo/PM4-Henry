import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { usersEntity } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(usersEntity)
    private usersRepository: Repository<usersEntity>,
  ) {}

  async findAllUsers(): Promise<
    Omit<usersEntity, 'password' | 'confirmPassword'>[]
  > {
    const users = await this.usersRepository.find();
    if (users.length === 0) {
      throw new NotFoundException('Users not found');
    }
    const usersWithoutPasswords = users.map(
      ({ password, confirmPassword, ...userWithoutPassword }) =>
        userWithoutPassword,
    );
    return usersWithoutPasswords;
  }

  async getUserById(
    id: string,
  ): Promise<Omit<usersEntity, 'password' | 'confirmPassword' | 'isAdmin'>> {
    const userData = await this.usersRepository.findOneBy({ id });

    if (!userData) {
      throw new NotFoundException(`User not found`);
    }
    const { password, confirmPassword, isAdmin, ...rest } = userData;
    return rest;
  }

  async createUser(
    userData: CreateUserDto,
  ): Promise<Omit<CreateUserDto, 'password' | 'confirmPassword' | 'isAdmin'>> {
    const newUser = await this.usersRepository.create(userData);
    if (!newUser) throw new BadRequestException('User already exists');
    await this.usersRepository.save(newUser);
    const { password, confirmPassword, isAdmin, ...rest } = newUser;
    return rest;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<usersEntity, 'password' | 'confirmPassword' | 'isAdmin'>> {
    let user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException(`User not found.`);
    }
    const updatedUser = await this.usersRepository.merge(user, updateUserDto);
    await this.usersRepository.save(updatedUser);
    const { password, confirmPassword, isAdmin, ...rest } = user;
    return rest;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException(`User not found.`);
    }
    await this.usersRepository.delete(id);
    return { message: 'User deleted successfully' };
  }

  async signinUser(email: string, password: string): Promise<usersEntity> {
    const sing = await this.usersRepository.findOne({
      where: { email: email, password: password },
    });
    if (!sing) {
      throw new BadRequestException('Invalid credentials');
    }
    return sing;
  }

  async getUserByEmail(email: string): Promise<usersEntity | null> {
    const user: usersEntity | null = await this.usersRepository.findOne({
      where: { email },
    });
    return user;
  }


}

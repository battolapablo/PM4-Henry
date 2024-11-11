import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly UsersRepository: UsersRepository) {}
  
  async create(createUserDto: CreateUserDto) {
    return await this.UsersRepository.createUser(createUserDto);
  }

  async findAll() {
    return await this.UsersRepository.findAllUsers();
  }

  async findOne(id: string) {
    return await this.UsersRepository.getUserById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.UsersRepository.updateUser(id, updateUserDto);
  }

  async remove(id: string): Promise<{ message: string }> {
    return await this.UsersRepository.deleteUser(id);
  }
}

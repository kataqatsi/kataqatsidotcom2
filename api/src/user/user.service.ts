import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserRequestDto, UpdateUserRequestDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserRequestDto) {
    try {
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const userData = { ...createUserDto, password: hashedPassword };
      
      const res = await this.userRepository.create(userData);
      // do something else
      return res;
    } catch (error) {
      throw error;
  }
  }

  async findAll() {
    try {
      const res = await this.userRepository.findAll();
      return res;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const res = await this.userRepository.findById(id);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      const res = await this.userRepository.findByEmail(email);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserRequestDto) {
    try {
      const res = await this.userRepository.update(id, updateUserDto);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const res = await this.userRepository.remove(id);
      // do something else
      return res;
    } catch (error) {
      throw error;
    }
  }
}

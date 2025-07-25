import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto, UsersResponseDto, CreateUserRequestDto, UpdateUserRequestDto } from './dto/user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { SuccessErrorResponseDto } from 'src/common/dto/response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserRequestDto) {
    try {
      const res = await this.userService.create(createUserDto);
      return {
        success: true,
        data: res,
      };
    } catch (error) {
      return {  
        success: false,
        error: {
          message: 'Failed to create user',
        },
      };
    }
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully',
    type: UsersResponseDto,
  })
  async findAll() {
    try {
      const res = await this.userService.findAll();
      return {
        success: true,
        data: res,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to find all users',
        },
      };
    }
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'User fetched successfully',
    type: UserResponseDto,
  })
  async findOne(@Param('id') id: string) {
    try {
      const res = await this.userService.findOne(id);
      return {
        success: true,
        data: res,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to find user by id',
        },
      };
    }
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserRequestDto) {
    try {
      const res = await this.userService.update(id, updateUserDto);
      return {
        success: true,
        data: res,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to update user',
        },
      };
    }
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: SuccessErrorResponseDto<null>,
  })
  async remove(@Param('id') id: string) {
    try {
      const res = await this.userService.remove(id);
      return {
        success: true,
        data: res,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to remove user',
        },
      };
    }
  }
}

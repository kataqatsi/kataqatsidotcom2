import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { SuccessErrorResponseDto } from 'src/common/dto/response.dto';

export class UserDataDto {
  id: string;
  name: string;
  email: string;
  age: number;
}

export class UserResponseDto extends SuccessErrorResponseDto<UserDataDto> {
  @ApiProperty({ type: UserDataDto })
  declare data: UserDataDto;
}

export class UsersResponseDto extends SuccessErrorResponseDto<UserDataDto[]> {
  @ApiProperty({ type: [UserDataDto] })
  declare data: UserDataDto[];
}


export class CreateUserRequestDto {
  name: string;
  email: string;
  age: number;
  password: string;
}

export class UpdateUserRequestDto {
  nested: Nested1Dto;
  name?: string;
  email?: string;
  age?: number;
}



export class Nested3Dto {
  field1: string;
  field2?: number;
  field3: string[];
}

export class Nested2Dto {
  field?: string;
  field2: number;
  field3: string;
  nested3?: Nested3Dto;
}

export class Nested1Dto {
  field1: string;
  field2?: number;
  nested2: Nested2Dto;
}


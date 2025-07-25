import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { SuccessErrorResponseDto } from 'src/common/dto/response.dto';
import { UserDataDto } from 'src/user/dto/user.dto';

export class JwtTokensDto {
  accessToken: string;
  refreshToken: string;
}

export class JwtTokensResponseDto extends SuccessErrorResponseDto<JwtTokensDto> {
  @ApiProperty({ type: JwtTokensDto })
  declare data: JwtTokensDto;
}


export class PasswordLoginRequestDto {
  email: string;
  password: string;
}

export class PasswordSignupRequestDto {
  name: string;
  email: string;
  age: number;
  password: string;
}

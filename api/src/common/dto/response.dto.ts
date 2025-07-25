import { ApiProperty } from '@nestjs/swagger';

export class ErrorInfoDto {
  @ApiProperty({ description: 'Error message' })
  message: string;

  @ApiProperty({ description: 'Error code', required: false })
  code?: string;
}

export class SuccessErrorResponseDto<T = any> {
  @ApiProperty({ description: 'Success status' })
  success: boolean;

  @ApiProperty({ description: 'Error information', required: false })
  error?: ErrorInfoDto;

  @ApiProperty({ description: 'Response data', required: false })
  data?: T;
}
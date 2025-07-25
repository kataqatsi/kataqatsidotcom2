import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtGuard } from './jwt-access.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { ApiResponse } from '@nestjs/swagger';
import { JwtTokensResponseDto, PasswordSignupRequestDto, PasswordLoginRequestDto } from './dto/auth.dto';
import { SuccessErrorResponseDto } from 'src/common/dto/response.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UserService) {}


    @UseGuards(JwtRefreshGuard)
    @Post('auth/refresh')
    async refresh(@Request() req) {
      return this.authService.refresh(req.user.refresh_token);
    }

    @UseGuards(JwtGuard)
    @Post('auth/logout')
    @ApiResponse({
        status: 200,
        description: 'User logged out successfully',
        type: SuccessErrorResponseDto,
      })
    async logout(@Request() req) {
      return req.logout();
    }

    @Post('auth/login/password')
    @ApiResponse({
        status: 201,
        description: 'User logged in successfully',
        type: JwtTokensResponseDto,
      })
    async login(@Request() passwordLoginRequestDto: PasswordLoginRequestDto) {
      return this.authService.login(passwordLoginRequestDto);
    }

    @Post('auth/register/password')
    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
        type: JwtTokensResponseDto,
      })
    async register(@Request() passwordSignupRequestDto: PasswordSignupRequestDto) {
      return this.userService.create(passwordSignupRequestDto);
    }

}

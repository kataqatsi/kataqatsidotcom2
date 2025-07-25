import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtAccessTokenStrategy } from './jwt-access.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { JwtRefreshTokenStrategy } from './jwt-refresh.strategy';
import { JwtGuard } from './jwt-access.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET!,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    AuthService, 
    LocalStrategy, 
    JwtAccessTokenStrategy, 
    JwtRefreshTokenStrategy, 
    JwtGuard, 
    JwtRefreshGuard
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
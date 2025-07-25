
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

const TOKEN_EXPIRATION = {
  ACCESS: '10m',
  REFRESH: '365d'
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { 
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: TOKEN_EXPIRATION.ACCESS
      }),
      refresh_token: this.jwtService.sign(payload, { 
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: TOKEN_EXPIRATION.REFRESH
      }),
    };
  }

  async refresh(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_REFRESH_SECRET')
    });
    return {
      access_token: this.jwtService.sign(payload, { 
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: TOKEN_EXPIRATION.ACCESS
      }),
      refresh_token: this.jwtService.sign(payload, { 
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: TOKEN_EXPIRATION.REFRESH
      }),
    };
  }
}

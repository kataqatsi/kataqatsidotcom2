import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { JwtGuard } from './auth/jwt-access.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.appService.getHello();
  }
}

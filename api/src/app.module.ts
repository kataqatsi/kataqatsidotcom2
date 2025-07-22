import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DbProvider } from './db/db.provider';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService, DbProvider],
  exports: [DbProvider],
})
export class AppModule {}

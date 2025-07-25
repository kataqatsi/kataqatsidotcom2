import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './db/db';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';
// import { ResponseInterceptor } from './common/interceptors/response.interceptor';
// import { DrizzleExceptionFilter } from './common/filters/drizzle-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('User API description')
    .setVersion('1.0')
    .addTag('user')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

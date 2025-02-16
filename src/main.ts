import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './exceptions/filters/global-exception.filter';
import { setupSwagger } from './config/SwaggerConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  // if(process.env.NODE_ENV === 'dev') {
  //   setupSwagger(app);
  // }
  setupSwagger(app);
  //全局数据验证管道
  app.useGlobalFilters(new GlobalExceptionFilter()); //注册全局过滤器
  await app.listen(3000);
  console.log(`Application is running on:http://localhost:3000`);
}

bootstrap()

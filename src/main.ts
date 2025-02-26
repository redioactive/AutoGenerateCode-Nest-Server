import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {BadRequestException, ValidationPipe} from '@nestjs/common';
import {GlobalExceptionFilter} from './exceptions/filters/global-exception.filter';
import {setupSwagger} from './config/SwaggerConfig';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: false,
            forbidNonWhitelisted: true,
            exceptionFactory: (errors) => {
                return new BadRequestException(errors);
            }
        }),
    );
    app.enableCors({
        allowedHeaders: ['Content-type', 'Authorization'],
        origin: true,
        credentials: true, //允许携带Cookie
        methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'],
    })
    //统一前缀
    app.setGlobalPrefix('api')
    setupSwagger(app);
    //全局数据验证管道
    app.useGlobalFilters(new GlobalExceptionFilter()); //注册全局过滤器

    app.use((req: { method: any; url: any; }, res: any, next: () => void) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });
    await app.listen(3000);
    console.log(`Application is running on:http://localhost:3000/api`);
}

bootstrap()

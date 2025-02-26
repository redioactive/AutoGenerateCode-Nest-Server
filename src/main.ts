import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {BadRequestException, ValidationPipe} from '@nestjs/common';
import {GlobalExceptionFilter} from './exceptions/filters/global-exception.filter';
import {setupSwagger} from './config/SwaggerConfig';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    //全局数据验证通道
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: false,
            forbidNonWhitelisted: true,
            exceptionFactory: (errors) => {
                return new BadRequestException(errors);
            }
        }),
    );

    //解决跨域问题
    app.enableCors({
        allowedHeaders: [
            'Content-Type',  // 修正名称
            'Authorization',
            'X-Requested-With'  // 建议添加常见Header
        ],
        origin: true,
        credentials: true,
        methods: ['*']  // 简化配置为允许所有方法
    });
    //统一前缀
    app.setGlobalPrefix('api')
    //Swagger
    setupSwagger(app);
    //全局数据验证管道
    app.useGlobalFilters(new GlobalExceptionFilter()); //注册全局过滤器

    app.use((req: { method: any; url: any; headers:any;body:any }, res: any, next: () => void) => {
        console.log('====== 原始请求信息 ======');
        console.log('Method:', req.method);
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Raw Body:', req.body); // 查看原始body
        console.log('Parsed Body:', req.body); // 查看解析后的body
        console.log('Response Body:', res.body);
        next();
    });
    await app.listen(3000);
    console.log(`Application is running on:http://localhost:3000/api`);
}

bootstrap()

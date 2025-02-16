import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './annotations/AuthGuard';
import { AppController } from './app.controller';
import {DictController} from './controllers/DictController';
import {DictService} from './services/DictService';
import { AppService } from './app.service';
import {UserService} from './services/user.service';
import { databaseConfig } from './config/database.config';
import { User } from './models/entity/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorsConfig } from './config/CorsConfig';
import { MustacheConfigurationConfig } from './config/MustacheConfigurationConfig';
import { LogInterceptor } from './aop/LoggingInterceptor';
import { Dict } from './models/entity/Dict';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Dict]), //注册实体
    ConfigModule.forRoot({
      isGlobal: true, // 全局模块，无需在其他模块中再次导入
      envFilePath: '.env', // 指定 .env 文件路径
    }),
    //使用forRootAsync动态注入env配置文件
    TypeOrmModule.forRoot(databaseConfig),
  ],
  controllers: [AppController,DictController],
  providers: [
    AppService,
    MustacheConfigurationConfig,
    DictService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
  ],
  exports: [MustacheConfigurationConfig,UserService], //导出以便其他模块使用
})
export class AppModule {
  //处理跨域
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsConfig).forRoutes({ path: '*', method: RequestMethod.ALL });
  }

  //不需要手动初始化数据库连接，TypeOrmModule会自动处理
  constructor() {
    console.log('AppModule Initialized');
  }
}


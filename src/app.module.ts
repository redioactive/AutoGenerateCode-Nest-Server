import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {APP_GUARD, APP_INTERCEPTOR} from '@nestjs/core';
import {AuthGuard} from './annotations/AuthGuard';
import {AppController} from './app.controller';
import {DictController} from './controllers/DictController';
import {SqlController} from './controllers/SqlController';
import {FieldInfoController} from './controllers/FieldInfoController';
import {ReportController} from './controllers/ReportController';
import {DictService} from './services/DictService';
import {AppService} from './app.service';
import {UserService} from './services/UserService';
import {ReportService} from './services/ReportService';
import {FieldInfoService} from './services/FieldInfoService';
import {databaseConfig} from './config/database.config';
import {User} from './models/entity/User';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MustacheConfigurationConfig} from './config/MustacheConfigurationConfig';
import {LogInterceptor} from './aop/LoggingInterceptor';
import {Dict} from './models/entity/Dict';
import {FieldInfo} from './models/entity/FieldInfo';
import {Report} from './models/entity/Report';
import {JwtModule} from "@nestjs/jwt";
import {ConfigService} from '@nestjs/config';
import {JwtStrategy} from "./config/JwtConfig";
import {UserController} from './controllers/UserController';


@Module({
    imports: [
        TypeOrmModule.forFeature([User, Dict, FieldInfo, Report]), //注册实体
        ConfigModule.forRoot({
            isGlobal: true, // 全局模块，无需在其他模块中再次导入
            envFilePath: '.env', // 指定 .env 文件路径
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {expiresIn: '7d'},
            }),
        }),
        //使用forRootAsync动态注入env配置文件
        TypeOrmModule.forRoot(databaseConfig),
    ],
    controllers: [AppController, DictController, FieldInfoController, ReportController, SqlController, UserController],
    providers: [
        AppService,
        MustacheConfigurationConfig,
        DictService,
        UserService,
        FieldInfoService,
        ReportService,
        JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LogInterceptor,
        },
    ],
    exports: [MustacheConfigurationConfig, UserService, JwtModule], //导出以便其他模块使用
})
export class AppModule {


    //不需要手动初始化数据库连接，TypeOrmModule会自动处理
    constructor() {
        console.log('AppModule Initialized');
    }
}


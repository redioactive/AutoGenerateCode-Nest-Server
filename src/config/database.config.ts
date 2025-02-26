import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import {User} from '../models/entity/User'

export const databaseConfig:TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  database: 'sqldev',
  entities: [User],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: true, // 禁用自动同步
  migrationsRun: true, // 每次启动时运行 migrations
  logging: process.env.NODE_ENV === 'development',
  charset: 'utf8mb4',
  timezone: 'Z',
}


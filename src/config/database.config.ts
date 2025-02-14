import {TypeOrmModuleOptions} from '@nestjs/typeorm';

export const databaseConfig:TypeOrmModuleOptions = {
  type:'mysql',
  host:'localhost',
  port:3306,
  username:'root',
  password:'123456',
  database:'sqldev',
  entities:[__dirname + '/../models/*.entity{.ts,.js}'],
  synchronize:true //仅用于开发环境，生产环境禁用
}


import { Injectable,OnModuleInit } from '@nestjs/common';
import {DataSource} from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}
  async onModuleInit(): Promise<void> {
    await  this.executeSqlFile()
  }
  //使用fs模块读取create_table.sql并通过queryRunner执行SQL语句
  private async executeSqlFile(): Promise<void> {
    const filePath = path.join(__dirname,'../sql/create_table.sql');
    const sql = fs.readFileSync(filePath,'utf-8');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try{
      console.log('Executing SQL file...');
      await queryRunner.query(sql);
      console.log('SQL file executed successfully!');
    }catch(error) {
      console.error('Failed to execute SQL file',error);
    }finally{
      await queryRunner.release()
    }
  }
}

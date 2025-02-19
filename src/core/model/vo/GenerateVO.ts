import { ApiProperty } from '@nestjs/swagger';
import {TableSchema} from '../../schema/TableSchema';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

/**
 * 生成的返回值
 */
export class GenerateVO {
  @ApiProperty({ description: '表结构信息', type: () => TableSchema })
  @IsObject()
  tableSchema: TableSchema;

  @ApiProperty({ description: '创建表的 SQL 语句' })
  @IsString()
  createSql: string;

  @ApiProperty({ description: '数据列表', type: () => [Object] })
  @IsArray()
  dataList: Record<string, any>[];

  @ApiProperty({ description: '插入 SQL 语句' })
  @IsString()
  insertSql: string;

  @ApiProperty({ description: 'JSON 格式的数据' })
  @IsString()
  dataJson: string;

  @ApiProperty({ description: '生成的 Nest 实体代码' })
  @IsString()
  nestEntityCode: string;

  @ApiProperty({ description: '生成的 Nest 对象代码' })
  @IsString()
  nestObjectCode: string;

  @ApiProperty({ description: '生成的 TypeScript 类型代码' })
  @IsString()
  typescriptTypeCode: Promise<string>;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

/**
 * 表概要
 */
export class TableSchema {
  @ApiProperty({ description: '数据库名称' })
  @IsString()
  dbName: string;

  @ApiProperty({ description: '表名称' })
  @IsString()
  tableName: string;

  @ApiProperty({ description: '表注释' })
  @IsString()
  tableComment: string;

  @ApiProperty({ description: '模拟数据条数' })
  @IsInt()
  mockNum: number;

  @ApiProperty({ description: '列信息列表', type: () => [Field] })
  @IsArray()
  fieldList: Field[];
}

/**
 * 列信息
 */
export class Field {
  @ApiProperty({ description: '字段名' })
  @IsString()
  fieldName: string;

  @ApiProperty({ description: '字段类型' })
  @IsString()
  fieldType: string;

  @ApiProperty({ description: '默认值', required: false })
  @IsOptional()
  @IsString()
  defaultValue?: string;

  @ApiProperty({ description: '是否非空' })
  @IsBoolean()
  notNull: boolean;

  @ApiProperty({ description: '字段注释（字段中文名）' })
  @IsString()
  comment: string;

  @ApiProperty({ description: '是否为主键' })
  @IsBoolean()
  primaryKey: boolean;

  @ApiProperty({ description: '是否自增' })
  @IsBoolean()
  autoIncrement: boolean;

  @ApiProperty({ description: '模拟类型（随机、图片、规则、词库）', required: false })
  @IsOptional()
  @IsString()
  mockType?: string;

  @ApiProperty({ description: '模拟参数', required: false })
  @IsOptional()
  @IsString()
  mockParams?: string;

  @ApiProperty({ description: '附加条件', required: false })
  @IsOptional()
  @IsString()
  onUpdate?: string;

  /**
   * 是否非空
   * @returns {boolean}
   */
  isNotNull(): boolean {
    return this.notNull;
  }

  /**
   * 是否为主键
   * @returns {boolean}
   */
  isPrimaryKey(): boolean {
    return this.primaryKey;
  }

  /**
   * 是否自增
   * @returns {boolean}
   */
  isAutoIncrement(): boolean {
    return this.autoIncrement;
  }
}

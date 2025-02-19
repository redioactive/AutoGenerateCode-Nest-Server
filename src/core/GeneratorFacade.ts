import { Injectable } from '@nestjs/common';
import { TableSchema, Field } from './schema/TableSchema';
import { SchemaException } from './schema/SchemaException';
import { SqlBuilder } from './builder/SqlBuilder';
import { DataBuilder } from './builder/DataBuilder';
import { JsonBuilder } from './builder/JsonBuilder';
import { NestCodeBuilder } from './builder/NestCodeBuilder';
import { FrontendCodeBuilder } from './builder/FrontendCodeBuilder';
import { GenerateVO } from './model/vo/GenerateVO';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class GeneratorFacade {
  /**
   * 生成所有内容
   * @param tableSchema
   * @param moduleRef
   * @returns GenerateVO
   * */
   public static  generateAll(tableSchema:TableSchema,moduleRef?:ModuleRef):GenerateVO {
    //校验 Schema
    this.validSchema(tableSchema);

    const sqlBuilder = new SqlBuilder();
    const nestCodeBuilder = new NestCodeBuilder();

    //生成键表SQL
    const createSql = tableSchema.fieldList
      .map(field => sqlBuilder.buildCreateFieldSql(field))
      .join(',\n') //用换行符拼接 多个字段的 SQL语句
    const mockNum = tableSchema.mockNum ?? 20;

    //生成模拟数据
    const dataList = DataBuilder.generateData(tableSchema,mockNum);

    //生成插入SQL
    const insertSql = DataBuilder.generateInsertSql(tableSchema, mockNum);

    //生成数据 JSON
    const dataJson = JsonBuilder.buildJson(dataList);

    //生成 Nest 实体代码
    const nestEntityCode = nestCodeBuilder.buildNestEntityCode(tableSchema);

    //生成 Nest 对象代码
    const nestObjectCode = nestCodeBuilder.buildObjectCode(tableSchema,dataList);

    //生成Typescript 类型代码
     const typescriptTypeCode = FrontendCodeBuilder.buildTypeScriptCodeStatic(moduleRef!,tableSchema);
    //封装返回值
    return {
      tableSchema,
      createSql,
      dataList,
      insertSql,
      dataJson,
      nestEntityCode,
      nestObjectCode,
      typescriptTypeCode
    }
  }
  /**
   * 验证Schema
   * @param tableSchema 表结构
   * */
  private static validSchema(tableSchema:TableSchema):void {
    if(!tableSchema) {
      throw new SchemaException('数据为空');
    }
    if(!tableSchema.tableName?.trim()) {
      throw new SchemaException('表名不能为空')
    }
    //默认生成20条
    const mockNum = tableSchema.mockNum ?? 20;
    tableSchema.mockNum = mockNum;
    if(mockNum > 100 || mockNum < 10) {
      throw new SchemaException('生成条数设置错误')
    }
    if(!tableSchema.fieldList || tableSchema.fieldList.length === 0) {
      throw new SchemaException('字段列表不能为空')
    }
    tableSchema.fieldList.forEach(this.validField);
  }

  /**
   * 校验字段
   * @param field
   * */
  private static validField(field:Field) : void {
    if(!field.fieldName?.trim()) {
      throw new SchemaException('字段名不能为空')
    }
    if(!field.fieldType?.trim()) {
      throw new SchemaException('字段类型不能为空')
    }
  }
}
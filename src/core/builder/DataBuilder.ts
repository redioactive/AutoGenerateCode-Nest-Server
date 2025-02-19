import { Injectable } from '@nestjs/common';
import {TableSchema,Field} from '../schema/TableSchema';
import { Faker, zh_CN } from '@faker-js/faker';

@Injectable()
export class DataBuilder {
  private static readonly faker = new Faker({locale:zh_CN});

  /**
   * 根据 TableSchema 生成模拟数据
   * @param tableSchema 表结构
   * @param num 生成的条数
   * @returns 模拟数据列表
   */
  public static generateData(tableSchema: TableSchema, num: number): Record<string, any>[] {
    if (!tableSchema || !tableSchema.fieldList || tableSchema.fieldList.length === 0) {
      throw new Error('TableSchema 或字段列表为空');
    }

    const dataList: Record<string, any>[] = [];

    for (let i = 0; i < num; i++) {
      const row: Record<string, any> = {};
      for (const field of tableSchema.fieldList) {
        row[field.fieldName] = this.generateFieldValue(field);
      }
      dataList.push(row);
    }

    return dataList;
  }

  /**
   * 根据字段类型生成对应的随机数据
   * @param field 字段定义
   * @returns 随机数据
   */
  private static generateFieldValue(field: Field): any {
    switch (field.fieldType.toLowerCase()) {
      case 'string':
      case 'varchar':
      case 'text':
        return this.faker.lorem.words(3);

      case 'int':
      case 'integer':
      case 'bigint':
      case 'smallint':
        return this.faker.number.int({ min: 1, max: 10000 });

      case 'float':
      case 'double':
      case 'decimal':
        return this.faker.number.float({min:0,max:10000}).toFixed(2)

      case 'boolean':
        return this.faker.datatype.boolean();

      case 'date':
      case 'datetime':
      case 'timestamp':
        return this.faker.date.past().toISOString();

      case 'email':
        return this.faker.internet.email();

      case 'phone':
        return this.faker.phone.number();

      case 'url':
        return this.faker.internet.url();

      case 'uuid':
        return this.faker.string.uuid();

      case 'ip':
        return this.faker.internet.ipv4();

      default:
        return this.faker.lorem.word();
    }
  }

  /**
   * 生成 INSERT SQL 语句
   * @param tableSchema 表结构
   * @param num 生成的条数
   * @returns 生成的 SQL 语句
   */
  public static generateInsertSql(tableSchema: TableSchema, num: number): string {
    const dataList = this.generateData(tableSchema, num);

    if (dataList.length === 0) {
      return '';
    }

    const tableName = tableSchema.tableName;
    const columns = tableSchema.fieldList.map(field => `\`${field.fieldName}\``).join(', ');

    const values = dataList
      .map(row => {
        const valueString = tableSchema.fieldList
        return `(${valueString})`;
      })
      .join(',\n');

    return `INSERT INTO \`${tableName}\` (${columns}) VALUES\n${values};`;
  }
  /**
   * 格式化 SQL 值，确保正确的 SQL 语法
   * @param value 字段值
   * @param fieldType 字段类型
   * @returns 格式化后的 SQL 值
   */
  private static formatSqlValue(value: any, fieldType: string): string {
    if (value === null || value === undefined) {
      return 'NULL';
    }

    switch (fieldType.toLowerCase()) {
      case 'int':
      case 'integer':
      case 'bigint':
      case 'smallint':
      case 'float':
      case 'double':
      case 'decimal':
        return value.toString();

      case 'boolean':
        return value ? '1' : '0';

      case 'date':
      case 'datetime':
      case 'timestamp':
        return `'${value}'`;

      default:
        return `'${String(value).replace(/'/g, "''")}'`; // 处理 SQL 注入风险
    }
  }
}

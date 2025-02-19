import { Injectable, Logger } from '@nestjs/common';
import { MySQLDialect } from './sql/MySQLDialect';
import { SQLDialect } from './sql/SQLDialect';
import { SQLDialectFactory } from './sql/SQLDialectFactory';
import { TableSchema } from '../schema/TableSchema';
import { Field } from '../schema/TableSchema';
import { FieldTypeEnum } from '../model/enums/FieldType';
import { MockTypeEnum } from '../model/enums/MockTypeEnum';

@Injectable()
export class SqlBuilder {
  private readonly logger = new Logger(SqlBuilder.name);
  private sqlDialect: SQLDialect;

  constructor() {
    this.sqlDialect = SQLDialectFactory.getDialect(MySQLDialect);
  }

  setSqlDialect(sqlDialect: SQLDialect) {
    this.sqlDialect = sqlDialect;
  }

  /**
   * 生成建表SQL
   * */
  buildCreateTableSql(tableSchema: TableSchema): string {
    const template = `%s\nCREATE TABLE IF NOT EXISTS %s (\n%s\n) %s;`;

    let tableName = this.sqlDialect.wrapFieldName(tableSchema.tableName);
    if (tableSchema.dbName) {
      tableName = `${tableSchema.dbName}.${tableName}`;
    }

    const tableComment = tableSchema.tableComment || tableName;
    const tablePrefixComment = `-- ${tableComment}`;
    const tableSuffixComment = `COMMENT '${tableComment}'`;

    const fieldDefinitions = tableSchema.fieldList
      .map((field) => this.buildCreateFieldSql(field))
      .join(',\n');

    const result = template
      .replace('%s', tablePrefixComment)
      .replace('%s', tableName)
      .replace('%s', fieldDefinitions)
      .replace('%s', tableSuffixComment);
    this.logger.log(`Generated SQL:${result}`);
    return result;
  }

  /**
   * 生成字段定义 SQL
   * */
  buildCreateFieldSql(field: Field): string {
    if (!field) throw new Error('Invalid field parameter');

    // 使用字段名，而不是表名
    const fieldName = this.sqlDialect.wrapFieldName(field.fieldName);
    let sql = `${fieldName} ${field.fieldType}`;

    if (field.defaultValue) {
      sql += ` DEFAULT ${this.getValueStr(field, field.defaultValue)}`;
    }
    sql += (field.isNotNull?.() ?? false) ? ' NOT NULL' : ' NULL';

    if (field.onUpdate) {
      sql += ` ON UPDATE ${field.onUpdate}`;
    }

    if (field.isAutoIncrement?.() ?? false) sql += ' AUTO_INCREMENT';
    if (field.comment) sql += ` COMMENT '${field.comment}'`;
    if (field.isPrimaryKey?.() ?? false) sql += ' PRIMARY KEY';

    return sql;
  }

  /**
   * 生成插入 SQL
   */
  buildInsertSql(tableSchema: TableSchema, dataList: Record<string, any>[]): string {
    const template = `INSERT INTO %s (%s)VALUES (%s);`;

    let tableName = this.sqlDialect.wrapTableName(tableSchema.tableName);
    if (tableSchema.dbName) {
      tableName = `${tableSchema.dbName}.${tableName}`;
    }

    const fieldList = tableSchema.fieldList.filter(
      (field) => field.mockType && MockTypeEnum[field.mockType] !== MockTypeEnum.NONE,
    );

    return dataList
      .map((data) => {
        const columns = fieldList.map((field) => this.sqlDialect.wrapFieldName(field.fieldName)).join(', ');
        const values = fieldList.map((field) => this.getValueStr(field, data[field.fieldName])).join(', ');
        return template.replace('%s', tableName).replace('%s', columns).replace('%s', values);
      })
      .join('\n');
  }

  /**
   * 处理字段值格式
   */
  private getValueStr(field: Field, value: any): string {
    if (!field || value === undefined || value === null) {
      return '\'\'';
    }

    const fieldType = FieldTypeEnum[field.fieldType] || FieldTypeEnum.TEXT;
    switch (fieldType) {
      case FieldTypeEnum.DATETIME:
      case FieldTypeEnum.TIMESTAMP:
        return value.toUpperCase() === 'CURRENT_TIMESTAMP' ? value : `'${value}'`;
      case FieldTypeEnum.DATE:
      case FieldTypeEnum.TIME:
      case FieldTypeEnum.CHAR:
      case FieldTypeEnum.VARCHAR:
      case FieldTypeEnum.TEXT:
      case FieldTypeEnum.BLOB:
        return `'${value}'`;
      default:
        return `${value}`;
    }
  }
}
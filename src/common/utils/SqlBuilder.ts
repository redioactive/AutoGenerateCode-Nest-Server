import {Field} from '../schema/TableSchema';

export class SqlBuilder {
  /**
   *根据字段信息生成创建字段的SQL 语句
   * @param field 字段对象，包含字段名称、数据类型、是否允许为空、默认值等属性
   * @param SQL 语句字符串
   * */
  buildCreateFieldSql(field:Field):string {
    //示例生成 : `字段名 数据类型 [NOT NULL] [DEFAULT '默认值']`
    let sql = `\`${field.fieldName}\` ${field.type} `;
    if(field.isNullable === false) {
      sql += 'NOT NULL';
    }
    if(field.defaultValue !== undefined && field.defaultValue !==null) {
      sql += `DEFAULT '${field.defaultValue}'`
    }
    return sql;
  }
}
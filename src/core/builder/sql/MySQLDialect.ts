import {SQLDialect} from './SQLDialect';

/**
 * MySQL 方言实现
 *
 * @author https://github.com/liyupi
 */
export class MySQLDialect implements SQLDialect {

  /**
   * 封装字段名
   * @param name 字段名
   * @returns 封装后的字段名
   */
  wrapFieldName(name: string): string {
    return `\`${name}\``;
  }

  /**
   * 解析字段名
   * @param fieldName 字段名
   * @returns 解析后的字段名
   */
  parseFieldName(fieldName: string): string {
    if (fieldName.startsWith('`') && fieldName.endsWith('`')) {
      return fieldName.slice(1, -1);
    }
    return fieldName;
  }

  /**
   * 封装表名
   * @param name 表名
   * @returns 封装后的表名
   */
  wrapTableName(name: string): string {
    return `\`${name}\``;
  }

  /**
   * 解析表名
   * @param tableName 表名
   * @returns 解析后的表名
   */
  parseTableName(tableName: string): string {
    if (tableName.startsWith('`') && tableName.endsWith('`')) {
      return tableName.slice(1, -1);
    }
    return tableName;
  }
}

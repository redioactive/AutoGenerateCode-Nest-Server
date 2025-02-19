/**
 * SQL方言接口
 * @author https://github.com/readioactive*/

export interface SQLDialect {
  /**
   * 封装字段名
   * @param name 字段名
   * @returns 封装后的字段名
   * */
  wrapFieldName(name:string):string;

  /**
   * 解析字段名
   * @param fieldName 字段名
   * @returns 解析后的字段名
   * */
  parseFieldName(fieldName:string):string;

  /**
   * 封装类名
   * @param name 表名
   * @returns 封装后的表名
   * */
  wrapTableName(name: string): string;

  /**
   * 解析表名
   * @param tableName 表名
   * @returns 解析后的表名
   * */
  parseTableName(tableName:string):string;
}
/**
 * 表示字段信息的接口
 * */

export interface Field {
  /**字段名称*/
  fieldName:string;
  /**数据库字段类型，例如VARCHAR(255)、INT等*/
  type:string;
  /**是否允许为空(默认为true)*/
  isNullable?:boolean;
  /**默认值 (如果有)*/
  defaultValue?:string;
}

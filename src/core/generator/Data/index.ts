import {Field} from '../../schema/TableSchema';

/**
 * 数据生成器接口
 * */
export interface DataGenerator {
  /**
   * 生成数据
   * @param field 字段信息
   * @param rowNum 行数
   * @returns 生成的数据列表
   * */
  doGenerate(field: Field, rowNum: number):Promise<string[]>;
}
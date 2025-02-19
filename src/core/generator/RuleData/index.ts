import {Injectable} from '@nestjs/common';
import {Field} from '../../schema/TableSchema';
import RandExp from 'randexp'

/**
 * 正则表达式数据生成器
 * */
@Injectable()
export class RuleDataGenerator {
  /**
   * 根据正则表达式生成随机数据
   * @param field 包含正则表达式的字段
   * @param rowNum 生成数据的数量
   * @returns 生成的字符串数组
   * */
  doGenerate(field:Field,rowNum:number): Promise<String[]> {
    const {mockParams} = field;
    const list:string[] = [];

    //创建 RandExp 实例
    // @ts-ignore
    const regexGen = new RandExp(mockParams);

    for(let i = 0; i < rowNum; i++) {
      list.push(regexGen.gen())
    }
    return Promise.resolve(list);
  }
}
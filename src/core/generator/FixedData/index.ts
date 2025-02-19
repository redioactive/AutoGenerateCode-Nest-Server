import { Injectable } from '@nestjs/common';
import { Field } from '../../schema/TableSchema';

@Injectable()
export class FixedDataGenerator {
  //生成固定mock数据的方法
  doGenerate(field: Field, rowNum: number): Promise<string[]> {
    let mockParams = field.mockParams;

    //如果 mockParams 为空或 null，则设置默认值
    if (!mockParams || mockParams.trim() === '') mockParams = '6';

    const list: string[] = [];

    //使用 mockParams 生成指定数量的行
    for (let i = 0; i < rowNum; i++) {
      list.push(mockParams);
    }
    return Promise.resolve(list);
  }
}
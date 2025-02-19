import {Injectable} from '@nestjs/common';
import {Field} from '../../schema/TableSchema';

@Injectable()
export class IncreaseDataGenerator {
  //生成递增数字序列的方法
  doGenerate(field:Field,rowNum:number): Promise<string[]> {
    let mockParams = field.mockParams;

    //如果 mockParams 为空或 null，则将初始值设置为默认值
    if(!mockParams || mockParams.trim() === '') mockParams = '1'; //如果没有提供值，则默认为 1

    const list:string[] = [];
    let initValue = parseInt(mockParams,10); //将 mockParams 转换为整数

    //生成递增序列
    for(let i = 0; i < rowNum; i++) {
      list.push(String(initValue + i));
    }
    return Promise.resolve(list);
  }
}
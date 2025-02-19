import { format } from 'date-fns';
import { Field } from '../../schema/TableSchema';
import { DataGenerator } from '../Data';

/**
 * 默认数据生成器
 * */
export class DefaultDataGenerator implements DataGenerator {
  doGenerate(field: Field, rowNum: number): Promise<string[]> {
    let mockParams: string | undefined = field.mockParams;
    const list: string[] = new Array(rowNum);

    //主键采用递增策略
    if (field.isPrimaryKey?.() ?? false) {
      if (!mockParams?.trim) {
        mockParams = '1';
      }
      const initValue = parseInt(mockParams, 10);
      for (let i = 0; i < rowNum; i++) {
        list[i] = String(initValue + 1);
      }
      return Promise.resolve(list);
    }

    //处理默认值
    let defaultValue: string | undefined = field.defaultValue;
    if (defaultValue === 'CURRENT_TIMESTAMP') {
      defaultValue = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    }
    if (defaultValue?.trim()) {
      list.fill(defaultValue);
    }
    return Promise.resolve(list);
  }
}
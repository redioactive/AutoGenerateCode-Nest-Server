import { Injectable } from '@nestjs/common';
import { DictService } from '../../../services/DictService';
import { BusinessException } from '../../../exceptions/BusinessException';
import { ErrorCode } from '../../../common/ErrorCode';
import { Field } from '../../schema/TableSchema';

@Injectable()
export class DictDataGenerator {
  constructor(private readonly dictService: DictService) {
  }

  async doGenerate(field: Field, rowNum: number): Promise<string[]> {
    const mockParams = field.mockParams;
    if (!mockParams) {
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code, '缺少词库 ID');
    }

    const id = Number(mockParams);
    if (isNaN(id)) {
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code, '词库 ID 无效');
    }

    const dict = await this.dictService.getDictById(id);
    if (!dict) {
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code, '词库不存在');
    }

    const wordList: string[] = JSON.parse(dict.content);
    if (!Array.isArray(wordList) || wordList.length === 0) {
      throw new BusinessException(ErrorCode.SYSTEM_ERROR.code, '词库内容无效');
    }

    const list: string[] = [];
    for (let i = 0; i < rowNum; i++) {
      const randomStr = wordList[Math.floor(Math.random() * wordList.length)];
      list.push(randomStr);
    }
    return list;
  }
}
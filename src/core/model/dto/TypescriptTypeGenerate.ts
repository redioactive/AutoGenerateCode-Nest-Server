import { ApiProperty } from '@nestjs/swagger';
import {FieldDTO} from './FieldDTO';

/**
 * Typescript 类型生成封装类
 * */

export class TypeScriptTypeGenerate {
  @ApiProperty({ description: '类名' })
  className: string;

  @ApiProperty({ description: '类注释' })
  classComment: string;

  @ApiProperty({description:'列信息列表',type:() => [FieldDTO]})
  fieldList:FieldDTO[];
}


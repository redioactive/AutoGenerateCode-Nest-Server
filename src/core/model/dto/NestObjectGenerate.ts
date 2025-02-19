import {ApiProperty} from '@nestjs/swagger';
import {FieldDTO} from './FieldDTO';

/**
 * Nest 对象生成封装类
 * */
export class NestObjectGenerate {
  @ApiProperty({description:'类名'})
  className:string;

  @ApiProperty({description:'对象名'})
  objectName:string;

  @ApiProperty({description:'列信息列表',type:() => [FieldDTO]})
  fieldList:FieldDTO[];
}
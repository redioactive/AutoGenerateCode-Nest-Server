import {ApiProperty} from '@nestjs/swagger'
import {FieldDTO} from './FieldDTO';
/**
 * Nest实体生成封装类
 * */
export class NestEntityGenerate {
  @ApiProperty({description:'类名'})
  className:string;

  @ApiProperty({description:'类注释'})
  classComment:string;

  @ApiProperty({type:() => [FieldDTO],description:'列信息列表'})
  fieldList:FieldDTO[];
}
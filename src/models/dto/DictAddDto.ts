import {IsString,IsOptional} from 'class-validator';

/**
 * 创建请求DTO
 * */
export class DictAddDto {
  /**
   * 用户id
   * */
  @IsOptional()
  userId:number;
  /**
   * 名称
   * */
  @IsString()
  name:string;
  /**
   * 内容
   * */
  @IsOptional()
  @IsString()
  content?:string;
}
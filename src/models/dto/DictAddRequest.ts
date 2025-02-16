import {IsString,IsOptional} from 'class-validator';

/**
 * 创建请求DTO
 * */
export class DictAddRequest {
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
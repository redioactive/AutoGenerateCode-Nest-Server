import { IsNotEmpty, IsString } from 'class-validator';

/**
 * 创建字段信息请求 DTO
 */
export class FieldInfoAddRequest {
  /**
   * 名称
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * 内容
   */
  @IsNotEmpty()
  @IsString()
  content: string;
}

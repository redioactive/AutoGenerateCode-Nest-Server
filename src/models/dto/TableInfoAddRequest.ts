import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * 创建表信息请求 DTO
 */
export class TableInfoAddRequest {
  /**
   * 名称
   */
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * 内容
   */
  @IsString()
  @IsOptional()
  content?: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

/**
 * 创建字段信息请求 DTO
 */
export class FieldInfoAddRequest {
  /**
   * 名称
   */
  @IsNotEmpty({ message: '名称不能为空' })
  @IsString()
  name: string;

  /**
   * 类型
   */
  @IsNotEmpty({ message: '类型不能为空' })
  @IsString()
  type: string;

  /**
   * 数据库字段名称
   */
  @IsNotEmpty({ message: '字段名称不能为空' })
  @IsString()
  fieldName: string;

  /**
   * 内容
   */
  @IsNotEmpty({ message: '内容不能为空' })
  @IsString()
  content: string;
}

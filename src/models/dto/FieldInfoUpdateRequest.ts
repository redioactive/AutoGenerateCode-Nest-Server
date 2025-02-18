import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import {FieldInfo} from '../entity/FieldInfo';

/**
 * 更新字段信息请求 DTO
 */
export class FieldInfoUpdateRequest implements Partial<FieldInfo> {
  /**
   * ID
   */
  @Type(() => Number)
  @IsPositive()
  id: number;

  /**
   * 名称
   */
  @IsOptional()
  @IsString()
  name?: string;
  /**
   * 字段名称
   */
  @IsOptional()
  @IsString()
  fieldName?: string;

  /**
   * 内容
   */
  @IsOptional()
  @IsString()
  content?: string;

  /**
   * 状态（0-待审核, 1-通过, 2-拒绝）
   */
  @IsOptional()
  @IsInt()
  reviewStatus?: number;

  /**
   * 类型
   * */
  @IsOptional()
  @IsString()
  type?:string;

  /**
   * 审核信息
   */
  @IsOptional()
  @IsString()
  reviewMessage?: string;
}
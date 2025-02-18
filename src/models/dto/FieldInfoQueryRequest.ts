import { IsOptional, IsString, IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import {PageRequestDto} from '../../common/PageRequest.dto';

/**
 * 查询字段信息请求 DTO
 */
export class FieldInfoQueryRequest extends PageRequestDto {
  /**
   * 同时搜索名称或字段名称
   */
  @IsOptional()
  @IsString()
  searchName?: string;

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
   * 内容，支持模糊查询
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
   * 创建用户 ID
   */
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  userId?: number;
  type?: boolean;
  /**
   * 页码 (分页查询时使用)
   */
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number;
}

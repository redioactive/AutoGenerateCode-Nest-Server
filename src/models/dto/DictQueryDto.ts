import {IsString, IsOptional, IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { PageRequestDto } from '../../common/PageRequest.dto';

/**
 * 通用查找 让他支持泛型
 */
export class DictQueryDto extends PageRequestDto {
  /**
   * 创建用户 id
   */
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  userId?: number;
  /**
   * 名称
   */
  @IsOptional()
  @IsString()
  name?: string;

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
}
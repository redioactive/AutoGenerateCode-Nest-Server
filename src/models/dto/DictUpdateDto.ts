import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 更新请求 DTO
 */
export class DictUpdateRequest {
  /**
   * id
   */
  @IsPositive()
  @Type(() => Number)
  id: number;

  /**
   * 名称
   */
  @IsOptional()
  @IsString()
  name?: string;

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
   * 审核信息
   */
  @IsOptional()
  @IsString()
  reviewMessage?: string;
}

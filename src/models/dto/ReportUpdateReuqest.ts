import { IsInt, IsPositive, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 举报更新请求 DTO
 */
export class ReportUpdateRequest {
  /**
   * 举报 ID
   */
  @IsPositive()
  @Type(() => Number)
  id: number;

  /**
   * 举报实体类型（0-词库）
   */
  @IsOptional()
  @IsInt()
  type?: number;

  /**
   * 状态（0-未处理, 1-已处理）
   */
  @IsOptional()
  @IsInt()
  status?: number;
}

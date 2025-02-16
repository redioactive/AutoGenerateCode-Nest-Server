import { IsString, IsInt, IsOptional, IsNumber, IsPositive } from 'class-validator';

/**
 * 更新表信息请求 DTO
 */
export class TableInfoUpdateRequest {
  /**
   * id
   */
  @IsNumber()
  @IsPositive()
  id: number;

  /**
   * 名称
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * 内容
   */
  @IsString()
  @IsOptional()
  content?: string;

  /**
   * 状态（0-待审核, 1-通过, 2-拒绝）
   */
  @IsInt()
  @IsOptional()
  reviewStatus?: number;

  /**
   * 审核信息
   */
  @IsString()
  @IsOptional()
  reviewMessage?: string;
}

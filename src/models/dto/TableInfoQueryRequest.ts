import { IsString, IsOptional, IsInt, IsNumber, IsPositive } from 'class-validator';
import { PageRequestDto } from '../../common/PageRequest.dto';

/**
 * 查询表信息请求 DTO
 */
export class TableInfoQueryRequest extends PageRequestDto {
  /**
   * 名称
   */
  @IsString()
  @IsOptional()
  name?: string;

  /**
   * 内容，支持模糊查询
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
   * 创建用户 id
   */
  @IsNumber()
  @IsOptional()
  @IsPositive()
  userId?: number;
}

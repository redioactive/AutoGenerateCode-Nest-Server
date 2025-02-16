import { IsString, IsInt, IsPositive, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import {PageRequestDto} from '../../common/PageRequest.dto';

/**
 * 举报查询请求 DTO
 */
export class ReportQueryRequest extends PageRequestDto {
  /**
   * 举报内容（可选）
   */
  @IsOptional()
  @IsString()
  content?: string;

  /**
   * 举报实体类型（0-词库）（可选）
   */
  @IsOptional()
  @IsInt()
  type?: number;

  /**
   * 被举报对象 ID（可选）
   */
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  reportedId?: number;

  /**
   * 被举报用户 ID（可选）
   */
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  reportedUserId?: number;

  /**
   * 举报状态（0-未处理, 1-已处理）（可选）
   */
  @IsOptional()
  @IsInt()
  status?: number;

  /**
   * 创建用户 ID（可选）
   */
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  userId?: number;
}

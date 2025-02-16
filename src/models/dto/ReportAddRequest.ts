import { IsString, IsInt, IsPositive } from 'class-validator';

/**
 * 举报创建请求 DTO
 */
export class ReportAddRequest {
  /**
   * 举报内容
   */
  @IsString()
  content: string;

  /**
   * 举报实体类型（0-词库）
   */
  @IsInt()
  type: number;

  /**
   * 被举报对象 ID
   */
  @IsPositive()
  reportedId: number;
}

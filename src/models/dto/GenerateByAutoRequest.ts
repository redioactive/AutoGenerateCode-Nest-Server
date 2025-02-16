import { IsString } from 'class-validator';

/**
 * 智能生成请求体 DTO
 */
export class GenerateByAutoRequest {
  /**
   * 内容
   */
  @IsString()
  content: string;
}

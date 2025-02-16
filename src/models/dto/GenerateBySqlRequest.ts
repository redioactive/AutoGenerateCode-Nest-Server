import { IsString } from 'class-validator';

/**
 * 根据 SQL 生成请求体 DTO
 */
export class GenerateBySqlRequest {
  /**
   * SQL 语句
   */
  @IsString()
  sql: string;
}

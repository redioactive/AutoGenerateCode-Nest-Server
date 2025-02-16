import { IsString, IsOptional, IsInt, IsEnum, IsDateString } from 'class-validator';
import {PageRequestDto} from '../../common/PageRequest.dto';

/**
 * 用户查询请求 DTO
 */
export class UserQueryRequest extends PageRequestDto {
  /**
   * id
   */
  @IsOptional()
  @IsInt()
  id?: number;

  /**
   * 用户昵称
   */
  @IsOptional()
  @IsString()
  userName?: string;

  /**
   * 账号
   */
  @IsOptional()
  @IsString()
  userAccount?: string;

  /**
   * 用户头像
   */
  @IsOptional()
  @IsString()
  userAvatar?: string;

  /**
   * 性别
   */
  @IsOptional()
  @IsInt()
  gender?: number;

  /**
   * 用户角色: user, admin
   */
  @IsOptional()
  @IsString()
  userRole?: string;

  /**
   * 创建时间
   */
  @IsOptional()
  @IsDateString()
  createTime?: string;

  /**
   * 更新时间
   */
  @IsOptional()
  @IsDateString()
  updateTime?: string;
}

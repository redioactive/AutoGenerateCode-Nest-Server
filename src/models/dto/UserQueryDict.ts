import { PageRequestDto } from '../../common/PageRequest.dto';
import { IsInt, IsOptional, IsString, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDictDto extends PageRequestDto {
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
  @IsEnum(['user', 'admin'])
  userRole?: string;

  /**
   * 创建时间
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createTime?: Date;

  /**
   * 更新时间
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updateTime?: Date;
}

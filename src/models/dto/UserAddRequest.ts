import { IsString, IsInt, IsOptional, IsEnum, IsNotEmpty, Length } from 'class-validator';

/**
 * 用户创建请求 DTO
 */
export class UserAddRequest {
  /**
   * 用户昵称
   */
  @IsString()
  @IsNotEmpty()
  userName: string;

  /**
   * 账号
   */
  @IsString()
  @IsNotEmpty()
  userAccount: string;

  /**
   * 用户头像
   */
  @IsString()
  @IsOptional()
  userAvatar?: string;

  /**
   * 性别
   */
  @IsInt()
  @IsOptional()
  gender?: number;

  /**
   * 用户角色: user, admin
   */
  @IsEnum({ user: 'user', admin: 'admin' })
  userRole: 'user' | 'admin';

  /**
   * 密码
   */
  @IsString()
  @Length(6, 20) // 密码长度要求6-20位
  @IsNotEmpty()
  userPassword: string;
}

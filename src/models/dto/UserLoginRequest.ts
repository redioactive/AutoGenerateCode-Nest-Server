import { IsString, IsNotEmpty } from 'class-validator';

/**
 * 用户登录请求 DTO
 */
export class UserLoginRequest {
  /**
   * 账号
   */
  @IsString()
  @IsNotEmpty()
  userAccount: string;

  /**
   * 密码
   */
  @IsString()
  @IsNotEmpty()
  userPassword: string;
}

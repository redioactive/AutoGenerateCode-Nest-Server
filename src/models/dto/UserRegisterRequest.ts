import { IsString, IsNotEmpty, IsEmail, Matches, IsOptional, MinLength, MaxLength } from 'class-validator';

/**
 * 用户注册请求 DTO
 */
export class UserRegisterDto {

  /**
   * 用户昵称
   */
  @IsNotEmpty()
  @IsString()
  userName: string;

  /**
   * 账号
   */
  @IsNotEmpty()
  @IsString()
  @IsEmail() // 如果是邮箱账号的话
  userAccount: string;

  /**
   * 密码
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(8)  // 至少 8 位密码长度
  @MaxLength(20) // 最多 20 位密码长度
  userPassword: string;

  /**
   * 确认密码
   */
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,20}$/, {
    message: 'checkPassword must match the password policy',
  })
  checkPassword: string;
}

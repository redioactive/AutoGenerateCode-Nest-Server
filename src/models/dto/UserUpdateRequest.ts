import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsInt, MinLength, MaxLength } from 'class-validator';

/**
 * 用户更新请求 DTO
 */
export class UserUpdateDto {

  /**
   * id
   */
  @IsInt()
  id: number;

  /**
   * 用户昵称
   */
  @IsOptional() // Optional: No validation for updates when the field is not provided
  @IsString()
  userName: string;

  /**
   * 账号
   */
  @IsOptional() // Optional: No validation for updates when the field is not provided
  @IsString()
  @IsEmail() // Validates if it's a valid email
  userAccount: string;

  /**
   * 用户头像
   */
  @IsOptional() // Optional: No validation for updates when the field is not provided
  @IsString()
  userAvatar: string;

  /**
   * 性别
   */
  @IsOptional() // Optional: No validation for updates when the field is not provided
  @IsInt()
  gender: number;

  /**
   * 用户角色: user, admin
   */
  @IsOptional() // Optional: No validation for updates when the field is not provided
  @IsEnum({ user: 'user', admin: 'admin' }) // Only 'user' or 'admin' are valid roles
  userRole: string;

  /**
   * 密码
   */
  @IsOptional() // Optional: No validation for updates when the field is not provided
  @IsString()
  @MinLength(8)  // Password should be at least 8 characters long
  @MaxLength(20) // Password should not be longer than 20 characters
  userPassword: string;
}

import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Matches,
  MinLength,
  MaxLength,
  ValidateIf,
  ValidationArguments
} from 'class-validator';

/**
 * 用户注册请求 DTO
 */
export class UserRegisterDto {

  /**
   * 用户昵称
   */
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString()
  userName: string;

  /**
   * 账号
   */
  @IsNotEmpty({ message: '账号不能为空' })
  @IsString()
  @IsEmail({}, { message: '请输入有效的邮箱' })
  @Matches(/.+@.+\..+/, { message: '账号必须是邮箱格式' }) // 确保是有效邮箱
  userAccount: string;

  /**
   * 密码
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: '密码至少8位' })
  @MaxLength(20,{message:'密码最多20位'})
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

  // 自定义校验逻辑，确保 `checkPassword` === `userPassword`
  @ValidateIf((dto: UserRegisterDto) => dto.userPassword !== dto.checkPassword, {
    message: 'Passwords do not match',
  })
  static passwordsMustMatch(dto: UserRegisterDto, args: ValidationArguments) {
    return dto.userPassword === dto.checkPassword;
  }
}

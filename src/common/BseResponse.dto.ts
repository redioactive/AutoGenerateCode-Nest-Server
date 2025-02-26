import {ApiProperty} from '@nestjs/swagger';
import {IsInt,IsOptional,IsString} from 'class-validator';

/**
 * 通用返回类
 * @param <T>数据类型
 * */
export class BaseResponseDto<T> {
  @ApiProperty({
    description : '响应代码',
    example : 200
  })
  @IsInt()
  code:number;

  @ApiProperty({
    description:'响应数据',
    example: {}
  })
  @IsOptional()
  data:T

  @ApiProperty({
    description:'响应信息',
    example:''
  })
  @IsString()
  @IsOptional()
  message?:string;

  constructor(code: number, data: any = null, message: string = '') {
    this.code = code;
    this.data = data;
    this.message = message;
  }
  static fromError(errorCode:{code:number,message:string}): BaseResponseDto<null> {
    return new BaseResponseDto(errorCode.code, null, errorCode.message)
  }
}
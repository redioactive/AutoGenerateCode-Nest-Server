import {ApiProperty} from '@nestjs/swagger';
import {ErrorCode} from "./ErrorCode";

/** 通用返回类 */
export class BaseResponse<T> {
  @ApiProperty({description:'状态码'})
  code:number;

  @ApiProperty({description:'返回数据',required:false})
  data?:T;

  @ApiProperty({description:'消息描述',required:false})
  message?:string;

  constructor(code:number,data?:T,message:string='') {
    this.code = code;
    this.data = data;
    this.message = message;
  }


  static success<T>(data?:T,message='请求成功'):BaseResponse<T> {
    return new BaseResponse<T>(200,data,message);
  }

  static error<T>(errorCode:ErrorCode,data?:T):BaseResponse<T> {
    return new BaseResponse<T>(errorCode.code,data);
  }
}
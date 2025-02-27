import {BaseResponse} from './BseResponse.dto';
import { ErrorCode } from './ErrorCode';

export class ResultUtilsDto {
  /**
   * 成功
   * @param data 响应数据*/
  static success<T>(data:T):BaseResponse<T> {
    return new BaseResponse<T>(0,data,'ok');
  }
  /**
   * 失败(根据ErrorCode枚举)
   * @param errorCode 错误码
   * */
  static error(errorCode:ErrorCode):BaseResponse<null> {
    return new BaseResponse<null>(errorCode.code,null,errorCode.message)
  }
  /**
   * 失败(自定义错误码与消息)
   * @param code 错误码
   * @param message 错误消息
   * */
  static errorWidthMessage(code:number,message:string):BaseResponse<null> {
    return new BaseResponse<null>(code,null,message);
  }
  /**
   * 失败(根据ErrorCode 枚举和自定义消息)
   * @param errorCode 错误码
   * @param message 自定义错误消息
   * */
  static errorWithCustomMessage(errorCode:ErrorCode,message:string):BaseResponse<null> {
    return new BaseResponse<null>(errorCode.code,null,message)
  }
}
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 业务异常类，用户抛出特定的业务逻辑错误
 * */
export class BusinessException extends HttpException {
  public readonly code: number;

  /**
   * @param code 错误码，类型为number
   * @param message 错误信息
   * @param status HTTP 状态码 默认值是HttpStatus.BAD_REQUEST*/

  constructor(code: number, message?: string, status: HttpStatus = HttpStatus.BAD_REQUEST) {
    super({ message, status }, status);
    this.code = code;
  }
}
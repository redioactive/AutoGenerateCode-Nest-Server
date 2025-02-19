import {HttpException, HttpStatus} from '@nestjs/common';

/**
 * SQL相关异常
 * */
export class SchemaException extends HttpException {
  constructor(message?:string,status:HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,cause?:Error) {
    super({
      message:message || 'Schema Exception',
      cause:cause ? cause.message : undefined,
    },
      status
    )

  }
}
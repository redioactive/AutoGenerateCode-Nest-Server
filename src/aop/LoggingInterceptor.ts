import {Injectable,NestInterceptor,ExecutionContext,CallHandler} from '@nestjs/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Request} from 'express';
import {v4 as uuidv4} from 'uuid';
import {Logger} from '@nestjs/common';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LogInterceptor.name);

  intercept(context:ExecutionContext,next:CallHandler):Observable<any> {
    const request:Request = context.switchToHttp().getRequest();
    const requestId = uuidv4() //生成唯一的请求ID
    const url = request.url;
    const ip = request.ip;
    const args = request.body; //假设请求参数是来自请求体
    const reqParam = `{${JSON.stringify(args)}` //获取请求参数

    //记录请求日志
    this.logger.log(`request start, id:${requestId},path:${url},ip:${ip},params:${reqParam}`);

    const now = Date.now(); //记录开始时间

    return next.handle().pipe(
      tap(() => {
        //计算请求处理时间
        const costTime = Date.now() - now;
        this.logger.log(`request end, id:${requestId},cost:${costTime}ms`);
      })
    )
  }
}
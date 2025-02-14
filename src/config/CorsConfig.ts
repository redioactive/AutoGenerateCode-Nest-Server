import {Injectable,NestMiddleware} from '@nestjs/common';
import {Request,Response,NextFunction} from 'express';

/**
 * 全局跨域配置
 * */
@Injectable()
export class CorsConfig implements NestMiddleware{
  use(req:Request, res:Response, next:NextFunction){
    res.header('Access-Control-Allow-Origin', '*'); //允许所有域名
    res.header('Access-Control-Allow-Credentials', 'true'); //允许发送Cookie
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Expose-Headers','*')
    next()
  }
}
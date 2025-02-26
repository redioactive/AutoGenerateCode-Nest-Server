import { Injectable, ExecutionContext,CanActivate } from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService:JwtService,private reflector:Reflector) {}
    canActivate(context:ExecutionContext):boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        //如果没有 Authorization 头部。则拒绝访问
        if(!authHeader) return false;

        try {
            //从 Authorization 头部中获取 Bearer token
            const token = authHeader.split(' ')[1];
            //使用JwtService 验证 token
            const decoded = this.jwtService.verify(token);
            //将解码后的用户信息房到请求的 user 属性中
            request.user = decoded;
            return true;
        }catch(error) {
            //如果token 验证失败。拒绝访问
            return false;
        }
    }
}
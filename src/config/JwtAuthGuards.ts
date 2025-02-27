import { Injectable, ExecutionContext,CanActivate,UnauthorizedException,NotFoundException } from '@nestjs/common';
import {IS_PUBLIC_KEY} from "../annotations/JwtDecorator";
import {AuthGuard} from "@nestjs/passport";
import {Observable} from "rxjs";
import {Reflector} from '@nestjs/core';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector:Reflector) { super(); }

    /** 验证token */
    canActivate(context:ExecutionContext):boolean | Promise<boolean> | Observable<boolean> {
        //是否公共路由
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if(isPublic) return true;
        //校验token
        return super.canActivate(context)
    }

    /**
     * @description: 验证完成后调用
     * @param {*} error 执行passport过程中发生的任何错误
     * @param {*} user 这是passport验证成功后返回的对象
     * @param {*} info 如果验证失败 info通常是一个error对象 @Author: mulingyuer
     *
     * */
    handleRequest(error: any, user: any, info: any) {
        if (error) {
            console.error('Error in passport:', error);  // 输出错误信息，帮助定位问题
            throw new UnauthorizedException('token校验失败');
        }
        if (info) {
            console.error('Info in passport:', info);  // 输出 info，帮助定位失败原因
            throw new UnauthorizedException('token校验失败');
        }
        if (!user) {
            throw new NotFoundException('用户不存在');
        }
        return user;
    }
}
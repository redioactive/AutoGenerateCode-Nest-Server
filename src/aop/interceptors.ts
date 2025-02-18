import {Injectable,NestInterceptor,ExecutionContext,CallHandler,UnauthorizedException} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserService } from '../services/UserService'; // 用户服务
import {Request} from 'express';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const authCheck = this.reflector.get<{ anyRole?: string[]; mustRole?: string }>(
      'auth-check',
      context.getHandler(),
    );

    if (!authCheck) {
      // 如果没有 @AuthCheck 装饰器，直接放行
      return next.handle();
    }

    const request: Request = context.switchToHttp().getRequest<Request>();
    const user = await this.userService.getLoginUser(request);

    if (!user) {
      throw new UnauthorizedException('用户未登录');
    }

    const { anyRole, mustRole } = authCheck;

    // 检查是否拥有任意角色
    if (anyRole && anyRole.length > 0) {
      if (!anyRole.includes(user.userRole)) {
        throw new UnauthorizedException('没有足够的权限');
      }
    }

    // 检查是否拥有必须的角色
    if (mustRole && mustRole !== user.userRole) {
      throw new UnauthorizedException('没有足够的权限');
    }

    // 权限校验通过，继续执行
    return next.handle();
  }
}

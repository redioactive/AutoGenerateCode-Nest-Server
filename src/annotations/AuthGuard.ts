import {CanActivate,ExecutionContext,Injectable,UnauthorizedException} from '@nestjs/common';
import {Reflector} from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector:Reflector) {}

  canActivate(context:ExecutionContext):boolean {
    const authCheck = this.reflector.get<{anyRole?:string[];mustRole?:string}>(
      'auth-check',
      context.getHandler()
    );
    if(!authCheck) {
      //如果方法上面没有 AuthCheck装饰器 ，则允许访问
      return true
    }

    const {anyRole,mustRole} = authCheck;
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if(!user) {
      throw new UnauthorizedException('用户未登录')
    }

    //检查必须拥有的角色
    if(mustRole && !user.roles.includes(mustRole)) {
      throw new UnauthorizedException(`需要角色:${mustRole}`)
    }

    //检查是否拥有任何一个角色
    if(anyRole && !anyRole.some((role) => user.roles.includes(role))) {
      throw new UnauthorizedException(`需要任意角色之一:${anyRole.join('，')}`)
    }
    return true
  }
}
import {Injectable,CanActivate,ExecutionContext,ForbiddenException} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ROLES_KEY} from '../../annotations/RolesDecorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector:Reflector) {}

  canActivate(context:ExecutionContext):boolean {
    //获取路由中设置的角色要求
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY,[
      context.getHandler(),
      context.getClass()
    ]);
    //如果没有设置角色显示，允许访问
    if(!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    //假设当前用户的角色存储在user.userRole 字段中(可以为字符串或者数组，根据实际情况调整)
    if(!user || !user.userRole) {
      throw new ForbiddenException('权限不足')
    }

    //如果user.userRole为字符串，则直接比较，若为数组，则检查交集
    const hasRole = Array.isArray(user.userRole)
    ? user.userRole.som((role:string) => requiredRoles.includes(role))
    : requiredRoles.includes(user.userRole)

    if(!hasRole) {
      throw new ForbiddenException('权限不足')
    }
    return true;
  }
}
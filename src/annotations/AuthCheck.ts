import {SetMetadata,CustomDecorator} from '@nestjs/common';

/**
 * 权限检验装饰器
 * `@AuthCheck()` 可用于方法，支持传入`anyRole`或mustRole参数进行权限控制*/
export const Auth_CHECK_KEY = 'auth-check';
export const AuthCheck = (
  roleOrOptions:string | {anyRole?:string[]; mustRole?:string}
):CustomDecorator => {
  //如果传入的是字符串直接转换为`mustRole:roleOrOptions`
  const options =
    typeof roleOrOptions  === 'string' ? {mustRole:roleOrOptions} : roleOrOptions;

  return SetMetadata(Auth_CHECK_KEY, options);
}

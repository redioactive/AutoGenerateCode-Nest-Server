import {SetMetadata} from '@nestjs/common';

/**
 * 权限检验装饰器
 * `@AuthCheck()` 可用于方法，支持传入`anyRole`或mustRole参数进行权限控制*/
export const Auth_CHECK_KEY = 'auth-check';
export const AuthCheck = (options:{anyRole?:string[];mustRole?:string} = {}) => {
  SetMetadata(Auth_CHECK_KEY, options);
}
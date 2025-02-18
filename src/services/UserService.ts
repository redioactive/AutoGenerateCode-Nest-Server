import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserMapper } from '../mappers/user.mapper';
import { User } from '../models/entity/User';

interface Request {
  user?:User;
}

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  async getUserById(id: number): Promise<User | null> {
    const userRepository = UserMapper(this.dataSource); // 初始化 UserMapper
    const user = await userRepository.findOneById(id); // 调用自定义方法
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  /**
   * 获取当前登录用户
   * @param request Express请求对象
   * @returns 当前登录用户或抛出 UnauthorizedException异常
   * */
  async getLoginUser(request: e.Request):Promise<User> {
    const user = request.user; //从请求中获取登录用户信息
    if(!user) {
      throw new UnauthorizedException('用户未登录');
    }
    //如果需要从数据库验证用户信息，可以通过ID查询用户
    const fullUser = await this.getUserById(user.id);
    if(!fullUser) {
      throw new UnauthorizedException('用户不存在')
    }
    return fullUser;
  }
}

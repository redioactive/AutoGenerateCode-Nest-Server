import {Injectable, UnauthorizedException, NotFoundException, BadRequestException} from '@nestjs/common';
import {DataSource, Like, Repository} from 'typeorm';
import {QueryDictDto} from "../models/dto/UserQueryDict";
import {User} from '../models/entity/User';
import {UserMapper} from "../mappers/user.mapper";
import {Request} from 'express';
import {JwtService} from '@nestjs/jwt';
import {scryptSync, randomBytes, timingSafeEqual} from 'crypto';
import {InjectRepository} from '@nestjs/typeorm';

/**
 * 使用 scrypt 算法生成密码散列
 * @param password 明文密码
 * @returns 格式为 "salt:hash" 的散列字符串
 */
function hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hashedBuffer = scryptSync(password, salt, 64);
    return `${salt}:${hashedBuffer.toString('hex')}`;
}

/**
 * 校验密码是否匹配
 * @param password 明文密码
 * @param hash 存储的散列值，格式为 "salt:hash"
 * @returns 是否匹配
 */
function verifyPassword(password: string, hash: string): boolean {
    const [salt, key] = hash.split(':');
    const hashedBuffer = scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, 'hex');
    return timingSafeEqual(hashedBuffer, keyBuffer);
}

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly dataSource: DataSource,
        private readonly jwtService: JwtService,
    ) {
    }

    async getUserById(id: number): Promise<User | null> {
        const userRepository = UserMapper(this.dataSource); // 初始化 UserMapper
        const user = await userRepository.findOneById(id); // 调用自定义方法
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    /**
     * 从请求中获取当前登录用户（需要配合JWT守卫使用）
     * @param request Express请求对象
     * @returns 当前登录用户
     */
    async getLoginUser(request: Request): Promise<User> {
        // 从JWT守卫设置的user属性获取用户信息
        const user = request.user as User;
        if (!user) {
            throw new UnauthorizedException('无效的认证令牌');
        }
        // 如果需要最新用户信息，可以查询数据库
        const fullUser = await this.getUserById(user.id);
        if (!fullUser) {
            throw new UnauthorizedException('用户不存在');
        }
        return fullUser;
    }

    /**
     * 判断用户是否为管理员
     * @param user 要检查的用户
     * @returns 用户是否为管理员
     * */
    isAdmin(user: User): boolean {
        return user.role === 'admin';
    }

    /**
     * 用户注册
     * @param userName 用户名称
     * @param userAccount 用户账号
     * @param userPassword 用户密码
     * @param checkPassword 密码校验
     * @param role 用户角色（例如默认角色）
     * @returns 新注册用户的ID
     */
    async userRegister(
        userName: string,
        userAccount: string,
        userPassword: string,
        checkPassword: string,
        role: string,
    ): Promise<number> {
        if (!userAccount || !userPassword || !checkPassword) {
            throw new BadRequestException('参数错误');
        }
        if (userPassword !== checkPassword) {
            throw new BadRequestException('两次输入的密码不一致');
        }
        const userRepository = UserMapper(this.dataSource);
        // 对密码进行加密（使用 Node.js 内置的 crypto 模块）
        const hashedPassword = hashPassword(userPassword);
        const newUser = new User();
        newUser.name = userName;
        newUser.userAccount = userAccount;
        newUser.userPassword = hashedPassword;
        newUser.role = role;
        // 保存用户到数据库
        const savedUser = await userRepository.save(newUser);
        return savedUser.id;
    }

    /**
     * 用户登录（JWT版本）
     * @param userAccount 用户账号
     * @param userPassword 用户密码
     * @returns 包含用户信息和访问令牌的对象
     */
    async userLogin(
        userAccount: string,
        userPassword: string,
    ): Promise<{ user: User; accessToken: string }> {
        if (!userAccount || !userPassword) {
            throw new BadRequestException('参数错误');
        }

        const userRepository = UserMapper(this.dataSource);
        // const user = await userRepository.findOneByAccount(userAccount);
        const user = await userRepository.findOne({
            where: {userAccount},
            select: ['id', 'userAccount', 'userPassword', 'role'],
        });
        if (!user) {
            throw new UnauthorizedException('用户不存在');
        }

        const passwordValid = verifyPassword(userPassword, user.userPassword);
        if (!passwordValid) {
            throw new UnauthorizedException('密码错误');
        }

        // 生成JWT令牌
        const payload = {
            sub: user.id,
            userAccount: user.userAccount,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload);

        // 返回用户信息（注意排除敏感信息）和令牌
        const {userPassword: _, ...safeUser} = user;
        return {
            user: safeUser as User,
            accessToken,
        };
    }

    /**
     * 用户登出（JWT版本，客户端需要自行删除令牌）
     * @returns 成功消息
     */
    async userLogout(): Promise<{ message: string }> {
        // JWT无状态，服务端不需要特殊处理
        return {message: '用户已成功登出，请客户端删除访问令牌'};
    }


    /**
     * 更新用户信息
     * @param user 包含更新数据的用户对象，必须包含id字段
     * @returns 更新是否成功
     * */
    async updateById(user: User): Promise<boolean> {
        if (!user || !user.id) {
            throw new BadRequestException('无效的用户信息');
        }
        const userRepository = UserMapper(this.dataSource);
        const existingUser = await userRepository.findOneById(user.id);
        if (!existingUser) {
            throw new NotFoundException('用户不存在');
        }
        //如果更新密码，需要重新加密处理
        if (user.userPassword && user.userPassword !== existingUser.userPassword) {
            user.userPassword = hashPassword(user.userPassword);
        }
        await userRepository.update(user.id, user);
        return true;
    }

    /**
     * 删除用户
     * @param id 用户ID
     * @returns 删除是否成功
     * */
    async removeById(id: number): Promise<boolean> {
        if (id <= 0) {
            throw new BadRequestException('参数错误');
        }
        const userRepository = UserMapper(this.dataSource);
        const existingUser = await userRepository.findOneById(id);
        if (!existingUser) {
            throw new NotFoundException('用户不存在');
        }
        await userRepository.remove(existingUser);
        return true;
    }

    /**
     * 获取用户列表
     * @param query 查询条件
     * @reutns 用户列表
     * */
    async list(query: Partial<User>): Promise<User[]> {
        const userRepository = UserMapper(this.dataSource);
        return await userRepository.find({where: query});
    }

    /**
     * 保存用户信息（创建或更新）
     * @param user 用户对象
     * @returns 保存后的用户对象
     */
    async save(user: Partial<User>): Promise<User> {
        if (!user || !user.email || !user.name) {
            throw new BadRequestException('用户信息不完整');
        }

        const savedUser = await this.userRepository.save(user);
        return savedUser;
    }

    /**
     * 分页获取用户列表
     * @returns 分页结果，包含当前页码、每页条数、总数和记录列表
     * @param queryDto
     * */
    async page(
        queryDto: QueryDictDto,
    ): Promise<{ current: number; size: number; total: number; records: User[] }> {
        const {current = 1, size = 10} = queryDto;

        //构建TypeORM查询条件
        const where = this.buildWhereCondition(queryDto);

        const userRepository = UserMapper(this.dataSource);
        const [records, total] = await userRepository.findAndCount({
            where,
            skip: (current - 1) * size,
            take: size,
        });
        return {current, size, total, records};
    }

    private buildWhereCondition(queryDto: QueryDictDto): Record<string, any> {
        const where: Record<string, any> = {};

        // 字段映射（将 DTO 字段映射到数据库字段）
        if (queryDto.id) where.id = queryDto.id;
        if (queryDto.userName) where.name = Like(`%${queryDto.userName}%`); // 模糊查询
        if (queryDto.userAccount) where.userAccount = Like(`%${queryDto.userAccount}%`);
        if (queryDto.gender) where.gender = queryDto.gender;
        if (queryDto.userRole) where.role = queryDto.userRole;

        // 处理日期范围（假设 createTime 是精确匹配）
        if (queryDto.createTime) {
            where.createTime = queryDto.createTime;
        }

        return where;
    }
}
import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    Req,
    UseGuards,
    BadRequestException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import {Request} from 'express';
import {UserService} from '../services/UserService';
import {UserRegisterDto} from "../models/dto/UserRegisterRequest";
import {UserLoginRequest} from "../models/dto/UserLoginRequest";
import {UserQueryRequest} from "../models/dto/UserQueryRequest";
import {UserUpdateDto} from "../models/dto/UserUpdateRequest";
import {User} from '../models/entity/User';
import {UserVO} from '../models/vo/UserVO';
import {Roles} from '../annotations/RolesDecorator';
import {RolesGuard} from "../common/guards/RolesGuard";
import {UserConstant} from '../constants/User_Constans';
import {DeleteRequestDto} from '../common/DeleteRequest.dto';
import {JwtService} from '@nestjs/jwt';
import {JwtAuthGuard} from "../annotations/JwtAuthGuards";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";


@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
    }

    /**
     * 用户注册
     * {
     *   "userName": "testUser",
     *   "userAccount": "test@example.com",
     *   "userPassword": "Password123",
     *   "checkPassword": "Password123"
     * }
     */
    @Post('register')
    async userRegister(@Body() userRegisterRequest: UserRegisterDto): Promise<{ code: number; data: number }> {
        if (!userRegisterRequest) {
            throw new BadRequestException('参数错误');
        }
        const {userName, userAccount, userPassword, checkPassword} = userRegisterRequest;

        if (!userAccount || !userPassword || !checkPassword || !userAccount.trim()) {
            throw new BadRequestException('账号不能为空');
        }
        if(userPassword !== checkPassword) {
            throw new BadRequestException('两次输入的密码不一致')
        }

        const existingUser = await this.userRepository.findOne({where:{userAccount}});
        if(existingUser) {
            throw new BadRequestException('该账号已被注册')
        }
        const result = await this.userService.userRegister(userName, userAccount, userPassword, checkPassword, UserConstant.DEFAULT_ROLE);
        return {code: 0, data: result};
    }

    /**
     * 用户登录
     * {
     *   "userAccount": "test@example.com",
     *   "userPassword": "Password123"
     * }
     */
    @Post('login')
    async userLogin(@Body() userLoginRequest: UserLoginRequest): Promise<{
        code: number;
        data: { user: UserVO; accessToken: string }
    }> {
        const {userAccount, userPassword} = userLoginRequest;
        if (!userAccount || !userPassword) {
            throw new BadRequestException('参数错误');
        }
        const {user} = await this.userService.userLogin(userAccount, userPassword);
        // 生成 JWT Token
        const accessToken = this.jwtService.sign(
            {
                userId: user.id,
                userAccount: user.userAccount, // 确保这里有 userAccount
            },
            {
                secret:process.env.JWT_SECRET || 'mySuperSecret',
                expiresIn:'7d'
            }
        );
        console.log('User password from DB:',user?.userPassword);
        const userVO = new UserVO();
        Object.assign(userVO, user);

        return {code: 0, data: {user: userVO, accessToken}};
    }

    /**
     * 用户注销 (JWT 无状态, 仅前端删除 Token)
     */
    @Post('logout')
    async userLogout(): Promise<{ code: number; data: string }> {
        return {code: 0, data: '用户已成功登出，请客户端删除访问令牌'};
    }

    /**
     * 获取当前登录用户 (需要JWT认证)
     * key:Authorization
     * value:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJBY2NvdW50IjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTc0MDE4NTU3OCwiZXhwIjoxNzQwMTg5MTc4fQ._4BrDghPrExZc0po1qT5IoTGVHI-ogIYHyvJ0H9ZJRA
     */
    @Get('get/login')
    @UseGuards(JwtAuthGuard)
    async getLoginUser(@Req() req: Request): Promise<{ code: number; data: UserVO }> {
        console.log('Decoded JWT user:',JSON.stringify(req.user,null,2))
        const user = req.user as User;

        const fullUser = await this.userService.getUserById(user.id);
        if (!fullUser) {
            throw new HttpException('用户不存在', HttpStatus.UNAUTHORIZED);
        }

        const userVO = new UserVO();
        Object.assign(userVO, fullUser);
        return {code: 0, data: userVO};
    }

    /**
     * 创建用户 (仅管理员)
     */
    @Post('add')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserConstant.ADMIN_ROLE)
    async addUser(@Body() userAddRequest: User, @Req() req: Request): Promise<{ code: number; data: number }> {
        if (!userAddRequest) {
            throw new BadRequestException('参数错误');
        }
        const result = await this.userService.save(userAddRequest);
        if (!result) {
            throw new HttpException('操作失败', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {code: 0, data: result.id};
    }

    /**
     * 删除用户 (仅管理员)
     */
    @Post('delete')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserConstant.ADMIN_ROLE)
    async deleteUser(@Body() deleteRequest: DeleteRequestDto): Promise<{ code: number; data: boolean }> {
        if (!deleteRequest || deleteRequest.id <= 0) {
            throw new BadRequestException('参数错误');
        }
        const result = await this.userService.removeById(deleteRequest.id);
        return {code: 0, data: result};
    }

    /**
     * 更新用户 (仅管理员)
     */
    @Post('update')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserConstant.ADMIN_ROLE)
    async updateUser(@Body() userUpdateRequest: UserUpdateDto): Promise<{ code: number; data: boolean }> {
        if (!userUpdateRequest || !userUpdateRequest.id) {
            throw new BadRequestException('参数错误');
        }

        // 从数据库中获取完整的 User 实例
        const existingUser = await this.userService.getUserById(userUpdateRequest.id);
        if (!existingUser) {
            throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
        }
        // 合并更新数据
        const updatedUser = Object.assign(existingUser, userUpdateRequest);

        // 调用服务层更新
        const result = await this.userService.updateById(updatedUser);
        return {code: 0, data: result};
    }

    /**
     * 根据 ID 获取用户 (仅管理员)
     */
    @Get('get')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserConstant.ADMIN_ROLE)
    async getUserById(@Query('id') id: number): Promise<{ code: number; data: UserVO }> {
        if (id <= 0) {
            throw new BadRequestException('参数错误');
        }
        const user = await this.userService.getUserById(id);
        const userVO = new UserVO();
        Object.assign(userVO, user);
        return {code: 0, data: userVO};
    }

    /**
     * 获取用户列表 (仅管理员)
     */
    @Get('list')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserConstant.ADMIN_ROLE)
    async listUser(@Query() userQueryRequest: UserQueryRequest): Promise<{ code: number; data: UserVO[] }> {
        const userList = await this.userService.list(userQueryRequest);
        const userVOList = userList.map((user) => {
            const userVO = new UserVO();
            Object.assign(userVO, user);
            return userVO;
        });
        return {code: 0, data: userVOList};
    }
}
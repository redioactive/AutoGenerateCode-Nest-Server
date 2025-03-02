import {Controller, Get, Post, Body, Query, Req, UseGuards, BadRequestException} from '@nestjs/common';
import {DictService} from '../services/DictService';
import {CreateDicDto, UpdateDicDto, QueryDictDto, DeleteDicDto} from '../models/dto/DictDto';
import {UserService} from '../services/UserService';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {generateVO} from '../models/vo/GenerateVO';
import {ErrorCode} from "../common/ErrorCode";
import {DictQueryDto} from '../models/dto/DictQueryDto';
import {BaseResponse} from "../common/BseResponse.dto";
import {DictAddDto} from "../models/dto/DictAddDto";
import {ReviewStatusEnum} from "../models/enums/ReviewStatusEnum";
import {Dict} from "../models/entity/Dict";
import {Roles} from "../annotations/RolesDecorator";
import {RolesGuard} from "../common/guards/RolesGuard";
import {BusinessException} from "../exceptions/BusinessException";
import {ResultUtilsDto} from "../common/ResultUtils.dto";
import {Page} from "../types/page";
import {User} from "../models/entity/User";
import {Request} from "express";
import {FindOptionsWhere} from "typeorm";
import {JwtAuthGuard} from "../annotations/JwtAuthGuards";

@ApiTags('词条管理')
@Controller('dict')
export class DictController {
    constructor(
        private readonly dictService: DictService,
        private readonly userService: UserService
    ) {}


    /**创建词条*/
    @Post('add')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary: '创建词条'})
    async addDict(@Body() dictAddDto: DictAddDto, @Req() request:Request) {
        if(!dictAddDto) {
            throw new Error('格式错误')
        }

        //验证和转换数据
        const dict = {...dictAddDto};

        //校验处理逻辑
        await this.dictService.validAddHandleDict(dict,true);

        //获取当前登录用户
        const loginUser = await this.userService.getLoginUser(request);
        dict.userId = loginUser.id;

        //保存字典数据
        const result = await this.dictService.save(dict);
        if(!result) {
            throw new Error('操作失败')
        }
        return ResultUtilsDto.success(dict.userId)
    }

    /**删除词条*/
    @Post('delete')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary: '删除词条'})
    async deleteDict(@Body() deleteRequestDto: DeleteDicDto, @Req() req) {
        const user = await this.userService.getLoginUser(req);
        return await this.dictService.deleteDict(deleteRequestDto.id, user);
    }

    /**更新词条(仅管理员)*/
    @Post('update')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary: '更新词条'})
    async updateDict(@Body() updateDictDto: UpdateDicDto) {
        return await this.dictService.updateDict(updateDictDto);
    }

    /**获取词条列表(管理员权限)*/
    @Get('my/list')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary: '获取当前用户创建的词条（仅管理员可查看所有词条）'})
    async listDict(@Query() dictQuery: DictQueryDto, @Req() req: Request): Promise<BaseResponse<Dict[]>> {
        if (!dictQuery) {
            throw new BadRequestException('获取词条失败')
        }
        //获取当前用户信息
        const user = req.user as User;

        //判断是否为管理员
        const isAdmin = user.role.indexOf('admin')

        //查询条件
        let where: any = this.dictService.getQueryWrapper(dictQuery)

        if (!isAdmin) {
            where.userId = user.id
        }
        const dictList = await this.dictService.list(where);
        return {message: '', code: 0, data: dictList};
    }

    /** 分页获取词条列表 */
    @Get('list/page')
    @ApiOperation({summary: '分页获取词条列表'})
    async listDictByPage(@Query() dictQueryPage: DictQueryDto): Promise<BaseResponse<Page<Dict>>> {
        const {current, pageSize} = dictQueryPage;
        // if (pageSize > 20) {
        //     throw new BusinessException(ErrorCode.PARAMS_ERROR.code)
        // }
        const dictPage = await this.dictService.page({current, pageSize}, dictQueryPage)
        return ResultUtilsDto.success(dictPage)
    }

    /** 分页获取当前用户的词条 */

    /**生成SQL*/
    @Post('generate/sql')
    @ApiOperation({summary: '生成SQL语句'})
    async generateCreateSql(@Body('id') id: number): Promise<generateVO> {
        return await this.dictService.generateCreateSql(id);
    }
}
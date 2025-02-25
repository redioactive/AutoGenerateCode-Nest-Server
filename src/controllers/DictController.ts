import {Controller, Get, Post, Body, Query, Req, UseGuards, BadRequestException} from '@nestjs/common';
import { DictService } from '../services/DictService';
import { CreateDicDto, UpdateDicDto, QueryDictDto, DeleteDicDto } from '../models/dto/DictDto';
import { AuthGuard } from '../annotations/AuthGuard';
import { AuthCheck } from '../annotations/AuthCheck';
import { UserService } from '../services/UserService';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { generateVO } from '../models/vo/GenerateVO';
import {JwtAuthGuard} from "../config/JwtAuthGuards";
import {DictQueryDto} from '../models/dto/DictQueryDto';
import {BaseResponseDto} from "../common/BseResponse.dto";
import {ReviewStatusEnum} from "../models/enums/ReviewStatusEnum";
import {Dict} from "../models/entity/Dict";
import {Roles} from "../annotations/RolesDecorator";
import {RolesGuard} from "../common/guards/RolesGuard";

@ApiTags('词条管理')
@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService, private readonly userService: UserService) {
  }


  /**创建词条*/
  @Post('add')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '创建词条' })
  async addDict(@Body() createDictDto: CreateDicDto, @Req() req) {
    const user = await this.userService.getLoginUser(req);
    return await this.dictService.addDict(createDictDto, user.id);
  }

  /**删除词条*/
  @Post('delete')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '删除词条' })
  async deleteDict(@Body() deleteRequestDto: DeleteDicDto, @Req() req) {
    const user = await this.userService.getLoginUser(req);
    return await this.dictService.deleteDict(deleteRequestDto.id, user);
  }

  /**更新词条(仅管理员)*/
  @Post('update')
  @AuthCheck('admin')
  @ApiOperation({ summary: '更新词条' })
  async updateDict(@Body() updateDictDto: UpdateDicDto) {
    return await this.dictService.updateDict(updateDictDto);
  }

  /**获取词条列表(管理员权限)*/
  @Get('my/list')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({summary:'获取词条列表（仅管理员可使用）'})
  async listDict(@Query() dictQueryDto:DictQueryDto):Promise<BaseResponseDto<Dict[]>> {
    if(!dictQueryDto) {
      throw new BadRequestException('获取账号失败')
    }
    //构造查询条件
    const queryOptions = this.dictService.getQueryWrapper(dictQueryDto);
    const dictList = await this.dictService.list(queryOptions);
    return {message: "", code:0,data:dictList}
  }

  /** 分页获取词条列表 */
  @Get('list/page')
  @ApiOperation({ summary: '分页获取词条列表' })
  async listDictByPage(@Query() queryDictDto: QueryDictDto) {
    return await this.dictService.listDictByPage(queryDictDto);
  }

  /** 分页获取当前用户的词条 */
  @Get('my/list/page')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '分页获取当前用户的词条' })
  async listMyDictByPage(@Query() queryDictDto: QueryDictDto, @Req() req) {
    const user = await this.userService.getLoginUser(req);
    return await this.dictService.listMyDictByPage(queryDictDto, user.id);
  }

  /**生成SQL*/
  @Post('generate/sql')
  @ApiOperation({ summary: '生成SQL语句' })
  async generateCreateSql(@Body('id') id: number): Promise<generateVO> {
    return await this.dictService.generateCreateSql(id);
  }
}
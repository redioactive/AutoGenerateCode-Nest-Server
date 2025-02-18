import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { DictService } from '../services/DictService';
import { CreateDicDto, UpdateDicDto, QueryDictDto, DeleteDicDto } from '../models/dto/DictDto';
import { AuthGuard } from '../annotations/AuthGuard';
import { AuthCheck } from '../annotations/AuthCheck';
import { UserService } from '../services/UserService';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { generateVO } from '../models/vo/GenerateVO';

@ApiTags('词条管理')
@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService, private readonly userService: UserService) {
  }

  /**创建词条*/
  @Post('add')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '创建词条' })
  async addDict(@Body() createDictDto: CreateDicDto, @Req() req: any) {
    const user = await this.userService.getLoginUser(req);
    return await this.dictService.addDict(createDictDto, user.id);
  }

  /**删除词条*/
  @Post('delete')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '删除词条' })
  async deleteDict(@Body() deleteRequestDto: DeleteDicDto, @Req() req: any) {
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
  @Get('list')
  @AuthCheck('admin')
  @ApiOperation({ summary: '获取词条列表' })
  async listDict(@Query() queryDictDto: QueryDictDto) {
    return await this.dictService.listDict(queryDictDto);
  }

  /** 分页获取词条列表 */
  @Get('list/page')
  @ApiOperation({ summary: '分页获取词条列表' })
  async listDictByPage(@Query() queryDictDto: QueryDictDto) {
    if (!this.dictService.listDictByPage) {
      throw new Error('listDictByPage 方法未定义，请在 DictService 中实现');
    }
    return await this.dictService.listDictByPage(queryDictDto);
  }

  /** 获取当前用户可用的词条 */
  @Get('my/list')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '获取当前用户可用的词条' })
  async listMyDict(@Query() queryDictDto: QueryDictDto, @Req() req: any) {
    const user = await this.userService.getLoginUser(req);
    if (!this.dictService.listMyDictByPage) {
      throw new Error('listMyDict 方法未定义，请在 DictService 中实现');
    }
    return await this.dictService.listMyDictByPage(queryDictDto, user.id);
  }

  /** 分页获取当前用户的词条 */
  @Get('my/list/page')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '分页获取当前用户的词条' })
  async listMyDictByPage(@Query() queryDictDto: QueryDictDto, @Req() req: any) {
    const user = await this.userService.getLoginUser(req);
    if (!this.dictService.listMyDictByPage) {
      throw new Error('listMyDictByPage 方法未定义，请在 DictService 中实现');
    }
    return await this.dictService.listMyDictByPage(queryDictDto, user.id);
  }

  /**生成SQL*/
  @Post('generate/sql')
  @ApiOperation({ summary: '生成SQL语句' })
  async generateCreateSql(@Body('id') id: number): Promise<generateVO> {
    return await this.dictService.generateCreateSql(id);
  }
}
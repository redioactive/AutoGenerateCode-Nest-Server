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
  HttpStatus, NotFoundException,
} from '@nestjs/common';
import { TableInfoService } from '../services/TableInfoService';
import { UserService } from '../services/UserService';
import { TableInfoAddRequest } from '../models/dto/TableInfoAddRequest';
import { TableInfoUpdateRequest } from '../models/dto/TableInfoUpdateRequest';
import { TableInfoQueryRequest } from '../models/dto/TableInfoQueryRequest';
import { TableInfo } from '../models/entity/TableInfo';
import { ReviewStatusEnum } from '../models/enums/ReviewStatusEnum';
import { SqlBuilder } from '../core/builder/SqlBuilder';
import { TableSchema } from '../core/schema/TableSchema';
import { Roles } from '../annotations/RolesDecorator';
import { Request } from 'express';
import { RolesGuard } from '../common/guards/RolesGuard';

@Controller('table_info')
export class TableInfoController {
  constructor(private readonly tableInfoService: TableInfoService, private readonly userService: UserService) {
  }

  /**
   * 创建表信息
   * */
  @Post('add')
  async addTableInfo(@Body() tableInfoAddRequest: TableInfoAddRequest, @Req() request: Request) {
    if (!tableInfoAddRequest) {
      throw new BadRequestException('参数错误');
    }
    //将DTO属性拷贝到实体对象中
    const tableInfo: TableInfo = { ...tableInfoAddRequest } as TableInfo;
    //参数校验与预处理 (此方法需要你再service层实现)
    await this.tableInfoService.validAndHandleTableInfoAdd(tableInfo, true);
    const loginUser = await this.userService.getLoginUser(request);
    tableInfo.userId = loginUser.id;
    const result = await this.tableInfoService.save(tableInfo);
    if (!result) {
      throw new HttpException('操作失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { code: 0, data: tableInfo.id };
  }

  /**
   * 更新表信息(仅管理员)
   * */
  @Post('update')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateTableInfo(@Body() tableInfoUpdateRequest: TableInfoUpdateRequest) {
    if (!tableInfoUpdateRequest || tableInfoUpdateRequest.id <= 0) {
      throw new BadRequestException('参数错误');
    }
    const tableInfo: TableInfo = { ...tableInfoUpdateRequest } as TableInfo;
    await this.tableInfoService.validAndHandleTableInfoAdd(tableInfo, true);
    const id = tableInfoUpdateRequest.id;
    const oldTableInfo = await this.tableInfoService.getByid(id);
    if (!oldTableInfo) {
      throw new NotFoundException('未找到对应数据');
    }
    const result = await this.tableInfoService.validAndHandleTableInfoUpdate(tableInfo);
    return { code: 0, data: result };
  }

  /**
   * 根据 id 获取表信息
   * */
  @Get('get')
  async getTableInfoById(@Query('id') id: number) {
    if (id <= 0) {
      throw new BadRequestException('参数错误');
    }
    const tableInfo = await this.tableInfoService.getById(id);
    return { code: 0, data: tableInfo };
  }

  /**
   * 分页获取表信息列表
   * */
  @Get('list/page')
  async listTableInfoByPage(@Query() query: TableInfoQueryRequest, @Req() request: Request) {
    const current = query.current;
    const size = query.pageSize;
    //限制判重，煤业最大返回20条
    if (size > 20) {
      throw new BadRequestException('参数错误');
    }
    const filter = this.getQueryWrapper(query);
    const tableInfoPage = await this.tableInfoService.page(current, size, filter);
    return { code: 0, data: tableInfoPage };
  }

  /**
   * 获取当前用户可选的全部资源列表 (只返回id 和 name字段)
   * */
  @Get('my/list')
  async listMyTableInfo(@Query() query: TableInfoQueryRequest, @Req() request: Request) {
    //先查询审核通过的记录
    const filterApproved = this.getQueryWrapper(query);
    filterApproved.where = { ...filterApproved.where, reviewStatus: ReviewStatusEnum.PASS };
    //指定返回字段
    filterApproved.select = ['id', 'name'];
    const approvedList = await this.tableInfoService.list(filterApproved);

    //再查询当前用户的记录
    let userList!: TableInfo[];
    try {
      const loginUser = await this.userService.getLoginUser(request);
      const userQuery = { ...query, userId: loginUser.id, reviewStatus: undefined };
      const filterUser = this.getQueryWrapper(userQuery);
      filterUser.select = ['id', 'name'];
      userList = await this.tableInfoService.list(filterUser);
    } catch (error) {
      console.error('获取当前用户记录失败:', error);
      //未登录时,将userList置为空数组
      userList = [];
    }
    //合并并根据id去重
    const combined = [...approvedList, ...userList];
    const resultMap = new Map<number, TableInfo>();
    combined.forEach(item => resultMap.set(item.id, item));
    const resultList = Array.from(resultMap.values());
    return { code: 0, data: resultList };
  }

  /**
   * 分页获取当前用户可选的资源列表
   * */
  @Get('my/list/page')
  async listMyTableInfoByPage(@Query() query: TableInfoQueryRequest, @Req() request: Request) {
    const loginUser = await this.userService.getLoginUser(request);
    const current = query.current;
    const size = query.pageSize;
    if (size > 20) {
      throw new BadRequestException('参数错误');
    }
    //构建条件:当前用户记录 OR 审核通过的记录
    const filter = this.getQueryWrapper(query);
    filter.where = {
      $or: [
        { userId: loginUser.id },
        { reviewStatus: ReviewStatusEnum.PASS },
      ],
    };
    const tableInfoPage = await this.tableInfoService.page(current, size, filter);
    return { code: 0, data: tableInfoPage };
  }

  /**
   * 生成创建表的 SQL
   * */
  @Post('generate/sql')
  async generateCreateSql(@Body('id') id: number) {
    if (id <= 0) {
      throw new BadRequestException('参数错误');
    }
    const tableInfo = await this.tableInfoService.getById(id);
    if (!tableInfo) {
      throw new NotFoundException('未找到对应数据');
    }
    let tableSchema: TableSchema;
    try {
      tableSchema = JSON.parse(tableInfo.content);
    } catch (error) {
      throw new HttpException('结构表结构失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const sqlBuilder = new SqlBuilder();
    const sql = sqlBuilder.buildCreateTableSql(tableSchema);
    return { code: 0, data: sql };
  }

  /**
   * 构建查询过滤条件
   * 模拟MyBatis 的 QueryWrapper，具体实现可依据 ORM 框架进行调整
   * */
  private getQueryWrapper(query: TableInfoQueryRequest): any {
    if (!query) {
      throw new BadRequestException('请求参数为空');
    }
    const { name, content, sortField, sortOrder, ...rest } = query;
    const where: any = { ...rest };
    if (name) {
      //模糊查询
      where.name = { $regex: name, $options: 'i' };
    }
    if (content) {
      where.content = { $regex: content, $options: 'i' };
    }
    const order = sortField ? { [sortField]: sortOrder === 'asc' ? 1 : -1 } : {};
    return { where, order };
  }
}

import { Controller, Get, Post, Body, Query, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { FieldInfoService } from '../services/FieldInfoService';
import { UserService } from '../services/UserService';
import { FieldInfoAddRequest } from '../models/dto/FieldInfoAddRequest';
import { FieldInfo } from '../models/entity/FieldInfo';
import { FieldInfoUpdateRequest } from '../models/dto/FieldInfoUpdateRequest';
import { FieldInfoQueryRequest } from '../models/dto/FieldInfoQueryRequest';
import { DeleteDicDto } from '../models/dto/DictDto';
import { AuthGuard } from '../annotations/AuthGuard';
import { RolesGuard } from '../common/guards/RolesGuard';
import { Roles } from '../annotations/RolesDecorator';
import { ReviewStatusEnum } from '../common/enums/ReviewStatusEnum';
import { SqlBuilder } from '../common/utils/SqlBuilder';
import { Field } from '../common/schema/TableSchema';
import { CommonConstants } from '../constants/Common_Constant';
import { FindOptionsSelect } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('过场')
@Controller('field_info')
export class FieldInfoController {
  constructor(
    private readonly fieldInfoService: FieldInfoService,
    private readonly userService: UserService,
  ) {
  }

  private buildQuery(queryDto: FieldInfoQueryRequest): any {
    if (!queryDto) {
      throw new BadRequestException('请求参数为空');
    }
    //copy queryDto 到一个新的查询对象中
    const query: any = { ...queryDto };
    const { searchName, sortField, sortOrder } = queryDto;
    //对name fieldName，content做模糊查询处理
    const { name, fieldName, content } = queryDto;
    //清除默认的精确匹配条件
    query.name = undefined;
    query.fieldName = undefined;
    query.conditions = [];
    if (name) {
      query.conditions.push({
        field: 'name',
        operator: 'like',
        value: `%${name}`,
      });
    }
    if (fieldName) {
      query.conditions.push({
        field: 'fieldName',
        operator: 'like',
        value: `%${fieldName}`,
      });
    }
    if (content) {
      query.conditions.push({
        field: 'content',
        operator: 'like',
        value: `%${content}`,
      });
    }
    //同时对name和fieldName 进行搜索
    if (searchName) {
      query.conditions.push({
        field: 'name',
        operator: 'like',
        value: `%${searchName}%`,
      });
      query.conditions.push({
        field: 'fieldName',
        operator: 'like',
        value: `%${searchName}%`,
        or: true,
      });
      //排序处理
      if (sortField) {
        query.orderBy = {
          field: 'fieldName',
          order:
            sortOrder === CommonConstants.SORT_ORDER_ASC ? 'ASC' : 'DESC',
        };
      }
      return query;
    }
  }

  /**
   * 创建字段
   * */
  @Post('add')
  async addFieldInfo(
    @Body() fieldInfoAddDto: FieldInfoAddRequest,
    @Req() req: Request,
  ) {
    if (!fieldInfoAddDto) {
      throw new BadRequestException('参数错误');
    }
    // 将 DTO 转换为实体对象
    const fieldInfo = new FieldInfo();
    fieldInfo.name = fieldInfoAddDto.name;
    fieldInfo.type = fieldInfoAddDto.type;
    fieldInfo.fieldName = fieldInfoAddDto.fieldName;
    fieldInfo.content = fieldInfoAddDto.content;
    // 其他实体属性（如 reviewStatus、reviewMessage 等）由 Service 或数据库默认值处理

    // 执行参数校验及预处理（注意：validAndHandleFieldInfo 方法应接收实体类型 FieldInfo）
    await this.fieldInfoService.validAndHandleFieldInfo(fieldInfo, true);

    // 获取当前登录用户（确保 userService.getLoginUser 返回的对象包含 id 属性）
    const loginUser = await this.userService.getLoginUser(req);
    // 将当前用户ID设置到字段记录中
    fieldInfo.userId = loginUser.id;

    // 调用 Service 层保存实体（确保 FieldInfoService 中有 save 方法）
    const result = await this.fieldInfoService.save(fieldInfo);
    if (!result) {
      throw new BadRequestException('操作错误');
    }
    return { add: result.id };
  }

  /**
   * 删除字段
   * */
  @Post('delete')
  async deleteFieldInfo(
    @Body() deleteDto: DeleteDicDto,
    @Req() req: Request,
  ) {
    if (!deleteDto || deleteDto.id <= 0) {
      throw new BadRequestException('参数错误');
    }
    const loginUser = await this.userService.getLoginUser(req);
    const fieldInfo = await this.fieldInfoService.getById(deleteDto.id);
    if (!fieldInfo) {
      throw new BadRequestException('未找到记录');
    }
    //仅允许本人或管理员删除
    const isAdmin = this.userService.isAdmin(loginUser);
    if (fieldInfo.userId !== loginUser.id && !isAdmin) {
      throw new BadRequestException('无权限');
    }
    const result = await this.fieldInfoService.removeById(deleteDto.id);
    return { data: result };
  }

  /**
   * 更新字段(仅管理员可操作)
   * */
  @Post('update')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async updateFieldInfo(@Body() fieldInfoUpdateDto: FieldInfoUpdateRequest) {
    if (!fieldInfoUpdateDto || fieldInfoUpdateDto.id <= 0) {
      throw new BadRequestException('参数错误');
    }
    //获取旧的字段信息
    const oldFieldInfo = await this.fieldInfoService.getById(fieldInfoUpdateDto.id);
    if (!oldFieldInfo) {
      throw new BadRequestException('未找到记录');
    }
    //校验数据
    await this.fieldInfoService.validAndHandleFieldInfo(fieldInfoUpdateDto, false);

    //更新记录
    const result = await this.fieldInfoService.updateById(fieldInfoUpdateDto);
    return { data: result };
  }

  /**
   * 根据id 获取字段信息
   * */
  @Get('get')
  async getFieldInfoById(@Query('id') id: number) {
    if (id <= 0) {
      throw new BadRequestException('参数错误');
    }
    const fieldInfo = await this.fieldInfoService.getById(id);
    return { data: fieldInfo };
  }

  /**
   * 获取全部字段列表 (仅管理员)
   * */
  @Get('list')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async listFieldInfo(@Query() queryDto: FieldInfoQueryRequest) {
    const query = this.buildQuery(queryDto);
    const list = await this.fieldInfoService.list(query);
    return { data: list };
  }

  /**
   * 分页获取字段列表
   * */
  @Get('list/page')
  async listFieldInfoByPage(
    @Query() queryDto: FieldInfoQueryRequest,
    @Req() req: Request,
  ) {
    const current = queryDto.current;
    const size = queryDto.pageSize;
    if (size > 20) {
      throw new BadRequestException('参数错误');
    }
    const query = this.buildQuery(queryDto);
    const pageRequest = await this.fieldInfoService.page({ current, size }, query);
    return { data: pageRequest };
  }

  /**
   * 获取当前用户可选的全部字段(只返回 id 和 name)
   * */
  @Get('my/list')
  async listMyFieldInfo(
    @Query() queryDto: FieldInfoQueryRequest,
    @Req() req: Request,
  ) {
    //构建查询条件:首先查询审核通过的字段
    const baseQuery = { ...queryDto, reviewStatus: ReviewStatusEnum.PASS };
    const fields = ['id', 'name'];
    let query = this.buildQuery(baseQuery);
    query.select = fields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as FindOptionsSelect<FieldInfo>);
    let list = await this.fieldInfoService.list(query);

    //再查询当前用户自己的字段(不限制审核状态)
    try {
      const loginUser = await this.userService.getLoginUser(req);
      const userQuery: FieldInfoQueryRequest = {
        ...queryDto,
        userId: loginUser.id,
        reviewStatus: undefined,
        current: queryDto.current ?? 1, //确保current存在
      };
      query = this.buildQuery(userQuery);
      query.select = fields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {} as FindOptionsSelect<FieldInfo>);
      const myList = await this.fieldInfoService.list(query);
      list = list.concat(myList);
    } catch (error) {
      //如果未登录则跳过查询
      throw new BadRequestException(error);
    }
    //去重(根据id去重)
    const deduped = Array.from(
      new Map(list.map((item) => [item.id, item])).values(),
    );
    return { data: deduped };
  }

  /**
   * 分页获取当前用户的可选字段列表
   * */
  @Get('my/list/page')
  async listMyFieldInfoByPage(
    @Query() queryDto: FieldInfoQueryRequest,
    @Req() req: Request,
  ) {
    const loginUser = await this.userService.getLoginUser(req);
    const current = queryDto.current;
    const size = queryDto.pageSize;
    if (size > 20) {
      throw new BadRequestException('参数错误');
    }
    let query = this.buildQuery(queryDto);
    //构建查询条件:用户ID等于当前用户，或审核状态为PASS
    query.where = [
      { userId: loginUser.id },
      { reviewStatus: ReviewStatusEnum.PASS },
    ];
    const pageResult = await this.fieldInfoService.page({ current, size }, query);
    return { data: pageResult };
  }

  /**
   * 分页获取当前用户创建的字段列表
   * */
  @Get('my/list/page')
  async listMyAddFieldInfoByPage(
    @Query() queryDto: FieldInfoQueryRequest,
    @Req() req: Request,
  ) {
    if (!queryDto) {
      throw new BadRequestException('参数错误');
    }
    const loginUser = await this.userService.getLoginUser(req);
    //限定查询条件为当前用户的创建的字段
    queryDto.userId = loginUser.id;
    const current = queryDto.current;
    const size = queryDto.pageSize;
    if (size > 20) {
      throw new BadRequestException('参数错误');
    }
    const query = this.buildQuery(queryDto);
    const pageResult = await this.fieldInfoService.page({ current, size }, query);
    return { data: pageResult };
  }

  /**
   * 生成创建字段的SQL
   * */
  @Post('generate/sql')
  async generateCreateSql(@Body('id') id: number) {
    if (id <= 0) {
      throw new BadRequestException('参数错误');
    }
    const fieldInfo = await this.fieldInfoService.getById(id);
    if (!fieldInfo) {
      throw new BadRequestException('未找到记录');
    }
    //将存储的JSON 内容转换未Field 对象
    const field: Field = JSON.parse(fieldInfo.content);
    const sqlBuilder = new SqlBuilder();
    const sql = sqlBuilder.buildCreateFieldSql(field);
    return { data: sql };
  }
}
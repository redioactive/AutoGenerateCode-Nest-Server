import { Controller, Get, Post, Body, Query, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ReportService } from '../services/ReportService';
import { DictService } from '../services/DictService';
import { UserService } from '../services/UserService';
import { ReportAddRequest } from '../models/dto/ReportAddRequest';
import { ReportUpdateRequest } from '../models/dto/ReportUpdateReuqest';
import { ReportQueryRequest } from '../models/dto/ReportQueryRequest';
import { DeleteRequestDto } from '../common/DeleteRequest.dto';
import { Report } from '../models/entity/Report';
import { User } from '../models/entity/User';
import { ReportStatusEnum } from '../models/enums/ReportStatusEnum';
import { BaseResponse } from '../common/BseResponse.dto';
import { ErrorCode } from '../common/ErrorCode';
import { ResultUtilsDto } from '../common/ResultUtils.dto';
import { BusinessException } from '../exceptions/BusinessException';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {JwtAuthGuard} from "../annotations/JwtAuthGuards";

@ApiTags('举报管理')
@Controller('report')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly dictService: DictService,
    private readonly userService: UserService,
  ) {
  }

  /**
   * 添加举报信息
   * @param reportAddRequest 举报请求对象
   * @param request Http请求对象
   * @returns 举报ID
   * */
  @Post('/add')
  @ApiOperation({ summary: '添加举报信息' })
  async addReport(@Body() reportAddRequest: ReportAddRequest, @Req() request: Request): Promise<BaseResponse<number>> {
    if (!reportAddRequest) {
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code);
    }
    const report = new Report();
    Object.assign(report, reportAddRequest);
    await this.reportService.validReport(report, true);
    const loginUser: User = await this.userService.getLoginUser(request);
    const dict = await this.dictService.getDictById(report.reportedId);
    if (!dict) {
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code, '举报对象不存在');
    }
    report.reportedUserId = dict.userId;
    report.userId = loginUser.id;
    report.status = ReportStatusEnum.DEFAULT();
    const saveReport = await this.reportService.save(report);
    return ResultUtilsDto.success(saveReport.id);
  }

  /**
   * 删除举报信息
   * @param deleteRequest 删除请求对象
   * @param request HTTP请求对象
   * @returns 是否删除成功
   * */
  @Post('/delete')
  @ApiOperation({ summary: '删除举报信息' })
  async deleteReport(@Body() deleteRequest: DeleteRequestDto, @Req() request: Request): Promise<BaseResponse<boolean>> {
    if (!deleteRequest || deleteRequest.id <= 0) {
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code);
    }
    const user = await this.userService.getLoginUser(request);
    const oldReport = await this.reportService.getById(deleteRequest.id);
    if (!oldReport) {
      throw new BusinessException(ErrorCode.NOT_FOUND_ERROR.code);
    }
    if (oldReport.userId !== user.id && !(this.userService.isAdmin(user))) {
      throw new BusinessException(ErrorCode.NO_AUTH_ERROR.code);
    }
    await this.reportService.removeById(deleteRequest.id);
    return ResultUtilsDto.success(true);
  }

  /**
   * 更新举报信息(仅管理员可用)
   * @param reportUpdateRequest 举报更新请求对象
   * @returns 是否更新成功
   * */
  @Post('/update')
  @ApiOperation({summary:'更新举报信息(仅管理员可用)'})
  @UseGuards(JwtAuthGuard)
  async updateReport(@Body() reportUpdateRequest:ReportUpdateRequest):Promise<BaseResponse<boolean>> {
    if(!reportUpdateRequest || reportUpdateRequest.id <= 0) {
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code);
    }
    const existingReport = await this.reportService.getById(reportUpdateRequest.id);
    if(!existingReport) {
      throw new BusinessException(ErrorCode.NOT_FOUND_ERROR.code);
    }
    Object.assign(existingReport,reportUpdateRequest);
    await this.reportService.validReport(existingReport,false);
    await this.reportService.updateById(existingReport);
    return ResultUtilsDto.success(true);
  }

  /**
   * 根据ID获取举报信息
   * @param id 举报ID
   * @returns 举报信息
   * */
  @Get('/get')
  @ApiOperation({summary:'根据ID获取举报信息'})
  async getReport(@Query('id') id:number):Promise<BaseResponse<Report | null>> {
    if(!id || id <= 0) {
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code);
    }
    const report = await this.reportService.getById(id);
    return ResultUtilsDto.success(report);
  }

  /**
   * 分页获取举报信息列表
   * @param query 举报查询请求对象
   * @returns 分页举报信息列表
   * */
  @Get('/list/page')
  @ApiOperation({summary:'分页获取举报信息列表'})
  async listReportByPage(@Query() query:ReportQueryRequest):Promise<BaseResponse<{items:Report[];total:number}>> {
    if(!query) {
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code);
    }
    const pagination = await this.reportService.page(query);
    return ResultUtilsDto.success(pagination)
  }
}
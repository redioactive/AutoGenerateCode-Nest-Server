import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import {ReportStatusEnum} from '../models/enums/ReportStatusEnum';
import {BusinessException} from '../exceptions/BusinessException';
import {ErrorCode} from '../common/ErrorCode';
import {Report} from '../models/entity/Report';
import { ReportQueryRequest } from '../models/dto/ReportQueryRequest';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}
  /**
   * 验证举报数据的有效性
   * @param report 举报实体
   * @param add 是否是创建操作
   * */
  async validReport(report:Report,add:boolean):Promise<void> {
    if(!report) {
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code,'参数错误');
    }
    const {content,reportedId,status} = report;
    if(content && content.length > 1024) {
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code,'内容过长')
    }
    if(add) {
      if(!reportedId || reportedId <= 0) {
        throw new BusinessException(ErrorCode.PARAMS_ERROR.code,'举报对象ID无效')
      }
    }else {
      if(status !== undefined && !ReportStatusEnum.values().includes(status)) {
        throw new BusinessException(ErrorCode.PARAMS_ERROR.code,'状态值无效')
      }
    }
  }

  /**
   * 保存举报信息
   * @param report 举报实体
   * */
  async save(report:Report):Promise<Report> {
    return this.reportRepository.save(report);
  }

  /**
   * 通过ID 获取举报信息
   * @param id 举报ID
   * */
  async getById(id:number):Promise<Report | null> {
    return this.reportRepository.findOne({where:{id}})
  }

  /**删除举报信息
   * @param id 举报id
   * */
  async removeById(id:number):Promise<void> {
    await this.reportRepository.delete(id);
  }

  /**
   * 更新举报信息
   * @param report 举报实体
   * */
  async updateById(report:Report):Promise<void> {
    const {id,...updateData} = report;
    await this.reportRepository.update(id,updateData);
  }

  /**
   * 分页查询举报信息
   * @param query 分页和过滤条件
   * @returns 包含分页结果的对象，包括items、total、current 和 pageSize
   * */
  async page(query:ReportQueryRequest):Promise<{items:Report[];total:number;current:number;pageSize:number}> {
    /**结构分页参数，设置默认值*/
    const {
      current = 1,
      pageSize = 10,
      sortField,
      sortOrder,
      ...filters
    } = query;

    //构造TypeORM查询选项
    const options:FindManyOptions<Report> = {
      where:filters,
      skip:(current - 1) * pageSize,
      take:pageSize
    }
    //如果指定排序字段，则添加排序条件
    if(sortField) {
      options.order = {
        [sortField]: sortOrder && sortOrder.toLocaleUpperCase() === 'ASC' ? 'ASC' : 'DESC'
      }
    }
    //使用findAndCount 同时获取数据和总数
    const [items,total] = await this.reportRepository.findAndCount(options);
    return {items,total,current,pageSize}
  }
}
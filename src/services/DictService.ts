import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateDicDto, UpdateDicDto, QueryDictDto } from '../models/dto/DictDto';
import { InjectRepository } from '@nestjs/typeorm';
import {FindManyOptions, FindOptionsWhere, Like, Repository} from 'typeorm';
import { Dict } from '../models/entity/Dict';
import { User } from '../models/entity/User';
import { generateVO } from '../models/vo/GenerateVO';
import {DictQueryDto} from "../models/dto/DictQueryDto";
import {Page} from "../types/page";


@Injectable()
export class DictService {
  constructor(@InjectRepository(Dict) private readonly dictRepository: Repository<Dict>) {
  }

  /**
   * 根据dictQueryDto 构造查询条件
   * */
  public getQueryWrapper(dictQueryDto:DictQueryDto):FindOptionsWhere<Dict> {
    //根据reviewStatus精准匹配
    const where:FindOptionsWhere<Dict> = {};
    if(dictQueryDto.name){
      //使用like模糊搜索
      where.name = Like(`%${dictQueryDto.name}%`);
    }
    if(dictQueryDto.content) {
      where.content = Like(`%${dictQueryDto.content}%`);
    }
    if(dictQueryDto.reviewStatus !== undefined && dictQueryDto.reviewStatus !== null) {
      where.reviewStatus = dictQueryDto.reviewStatus;
    }
    return where
  }
  /**
   * 校验并处理
   * @param dict 词条对象
   * @param add 是否为创建校验
   * */
  async validAddHandleDict(dict: Dict, add: boolean): Promise<void> {
    if (!dict.name || !dict.value) {
      throw new Error('名称和值不能为空');
    }
    if (add) {
      const exists = await this.dictRepository.findOne({ where: { name: dict.name } });
      if (exists) {
        throw new Error('该词条已存在');
      }
    }
  }

  /**创建词条*/
  async addDict(createDicDto: CreateDicDto, userId: number): Promise<Dict> {
    const dict = this.dictRepository.create({ ...createDicDto, userId });
    await this.validAddHandleDict(dict, true);
    return await this.dictRepository.save(dict);
  }

  /**更新词条*/
  async updateDict(updateDictDto: UpdateDicDto): Promise<Dict> {
    const dict = await this.dictRepository.findOne({ where: { id: updateDictDto.id } });
    if (!dict) throw new NotFoundException('词条不存在');
    Object.assign(dict, updateDictDto);
    await this.validAddHandleDict(dict, false);
    return await this.dictRepository.save(dict);
  }

  /**删除词条*/
  async deleteDict(id: number, user: User): Promise<void> {
    const dict = await this.dictRepository.findOne({ where: { id } });
    if (!dict) throw new NotFoundException('词条不存在');
    if (dict.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('无权限删除');
    }
    await this.dictRepository.delete(id);
  }

  /**根据ID获取词条*/
  async getDictById(id: number): Promise<Dict> {
    const dict = await this.dictRepository.findOne({ where: { id } });
    if (!dict) throw new NotFoundException('词条不存在');
    return dict;
  }

  /**获取词条列表(可分页、可筛选)*/
  async list(dictQueryDto: DictQueryDto):Promise<Dict[]> {
    const where = this.getQueryWrapper(dictQueryDto);
    return await this.dictRepository.find({
      where,
      skip:dictQueryDto.current ? (dictQueryDto.current - 1) * dictQueryDto.pageSize : 0,
      take:dictQueryDto.pageSize || 10
    })
  }

  /**分页获取词条列表*/
  async page(pagination:{current:number;pageSize:number;},dictQuery:DictQueryDto):Promise<Page<Dict>> {
    const {current = 1,pageSize = 10} = pagination;
    const queryWrapper =  this.getQueryWrapper(dictQuery);
    const [records,total] = await Promise.all([
        this.dictRepository.find({
          where:queryWrapper,
          skip:(current - 1) * pageSize,
          take:pageSize
        }),
        this.dictRepository.count({where:queryWrapper})
    ]);
    return {records,total,current,pageSize}
  }


  /**生成SQL*/
  async generateCreateSql(id: number): Promise<generateVO> {
    const dict = await this.getDictById(id);
    const sql = `INSERT INFO dict (name,value,userId) VALUES ('${dict.name}','${dict.value}',${dict.userId})`;
    return { sql };
  }

  private async find(options: FindManyOptions<Dict> | undefined):Promise<Dict[]> {
    return await this.dictRepository.find(options);
  }
}
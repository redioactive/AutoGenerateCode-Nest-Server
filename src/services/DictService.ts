import {
  Injectable,
  NotFoundException,
  ForbiddenException, BadRequestException,
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
   * @param isNew 是否是新增
   * */
  async validAddHandleDict(dict: Partial<Dict>, isNew:boolean): Promise<void> {
    // 1. 必须填写字段校验
    if (!dict.name || !dict.value) {
      throw new Error('名称和值不能为空');
    }
    // 2. 名称长度校验
    if(dict.name.length < 2 || dict.name.length > 50) {
      throw new BadRequestException('字典长度必须在2-50个字符之间')
    }
    // 3. 名称格式校验 （只能包含字母、数字、下划线和中文）
    const nameRegex = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
    if(!nameRegex.test(dict.name)) {
      throw new BadRequestException('字典名称只能包含字母、数字、下划线和中文')
    }
    // 4. 去重校验
    if(isNew) {
      const existing = await this.dictRepository.findOne({where:{name:dict.name}});
      if(existing) {
        throw new BadRequestException('字典名称已存在')
      }
    }
    // 5. 描述字段校验 （长度限制）
    if(dict.description && dict.description.length > 255) {
      throw new BadRequestException('字典描述不能超过 255个字符')
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

  /**
   * 保存字典数据
   * @param dict 字典实体
   * @returns 保存后的字典
   * */
  async save(dict:Partial<Dict>):Promise<Dict> {
    try {
      return await this.dictRepository.save(dict);
    }catch(error) {
      throw new Error(`保存字典失败:${error.message}`);
    }
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
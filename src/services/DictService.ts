import { Injectable,NotFoundException,ForbiddenException } from '@nestjs/common';
import {CreateDicDto,UpdateDicDto,QueryDictDto} from '../models/dto/DictDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dict } from '../models/entity/Dict';
import { User } from '../models/entity/User';
import {generateVO} from '../models/vo/GenerateVO';


@Injectable()
export class DictService {
  constructor(@InjectRepository(Dict) private readonly dictRepository: Repository<Dict>) {
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
  async addDict(createDicDto:CreateDicDto,userId:number): Promise<Dict> {
    const dict = this.dictRepository.create({...createDicDto,userId});
    await this.validAddHandleDict(dict,true);
    return await this.dictRepository.save(dict);
  }
  /**更新词条*/
  async updateDict(updateDictDto:UpdateDicDto):Promise<Dict>{
    const dict = await this.dictRepository.findOne({where:{id:updateDictDto.id}});
    if(!dict) throw new NotFoundException('词条不存在');
    Object.assign(dict,updateDictDto);
    await this.validAddHandleDict(dict,false);
    return await this.dictRepository.save(dict);
  }
  /**删除词条*/
  async deleteDict(id:number,user:User):Promise<void> {
    const dict = await this.dictRepository.findOne({where:{id}});
    if(!dict) throw new NotFoundException('词条不存在');
    if(dict.userId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('无权限删除');
    }
    await this.dictRepository.delete(id);
  }
  /**根据ID获取词条*/
  async getDictById(id:number):Promise<Dict> {
    const dict = await this.dictRepository.findOne({where:{id}});
    if(!dict) throw new NotFoundException('词条不存在');
    return dict;
  }
  /**获取词条列表(可分页、可筛选)*/
  async listDict(queryDto:QueryDictDto):Promise<Dict[]> {
    const {current = 1, pageSize = 10,sortField,sortOrder} = queryDto;
    const queryBuilder = this.dictRepository.createQueryBuilder('dict')
    if(sortField) {
      queryBuilder.orderBy(`dict.${sortField}`,sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC')
    }
    return await queryBuilder.skip((current - 1) * pageSize).take(pageSize).getMany()
  }
  /**生成SQL*/
  async generateCreateSql(id:number):Promise<generateVO> {
    const dict = await this.getDictById(id);
    const sql = `INSERT INFO dict (name,value,userId) VALUES ('${dict.name}','${dict.value}',${dict.userId})`
    return {sql};
  }
}
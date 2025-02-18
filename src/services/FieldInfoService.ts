import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { FieldInfo } from '../models/entity/FieldInfo';
import { UserMapper } from '../mappers/user.mapper';
import { FieldInfoUpdateRequest } from '../models/dto/FieldInfoUpdateRequest';

@Injectable()
export class FieldInfoService {
  constructor(
    @InjectRepository(FieldInfo)
    private readonly fieldInfoRepository: Repository<FieldInfo>,
    private readonly dataSource: DataSource,
  ) {
  }

  // 校验及处理方法（根据你的业务逻辑实现）
  async validAndHandleFieldInfo(fieldInfo: FieldInfoUpdateRequest, add: boolean): Promise<void> {
    // 示例：检查名称和类型不能为空
    if (!fieldInfo.name || fieldInfo.name.trim() === '') {
      throw new Error('字段名称不能为空');
    }
    if (!fieldInfo.type || fieldInfo.type.trim() === '') {
      throw new Error('字段类型不能为空');
    }
    // 如果是新增，还可以做其他验证，如唯一性检查等
    if (add) {
      const existing = await this.fieldInfoRepository.findOne({ where: { name: fieldInfo.name } });
      if (existing) {
        throw new Error('字段名称已存在');
      }
    }
  }

  // 保存方法
  async save(fieldInfo: FieldInfo): Promise<FieldInfo> {
    return await this.fieldInfoRepository.save(fieldInfo);
  }

  //根据 ID 获取字段信息
  async getById(id: number | undefined): Promise<FieldInfo | null> {
    return await this.fieldInfoRepository.findOne({ where: { id } });
  }

  /**
   * 根据 ID 更新字段信息
   * */
  async updateById(updateData: Partial<FieldInfo>): Promise<FieldInfo> {
    const existingFieldInfo = await this.getById(updateData.id);
    if (!existingFieldInfo) {
      throw new NotFoundException('未找到记录');
    }

    //更新字段
    Object.assign(existingFieldInfo, updateData);
    return await this.fieldInfoRepository.save(existingFieldInfo);
  }

  /**
   * 根据 ID删除用户
   * @param id 用户ID
   * */
  async removeById(id: number): Promise<void> {
    const userRepository = UserMapper(this.dataSource);
    const user = await userRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException('未找到用户');
    }
    await userRepository.delete(id);
  }

  /**
   * 获取字段信息列表
   * @param query 查询参数
   * @returns 字段信息列表
   * */
  async list(query: FindManyOptions<FieldInfo>): Promise<FieldInfo[]> {
    return await this.fieldInfoRepository.find(query);
  }

  //分页查询方法
  async page(
    pagination: { current: number, size: number },
    query: FindManyOptions<FieldInfo>,
  ): Promise<{ items: FieldInfo[]; total: number; current: number; size: number }> {
    const { current, size } = pagination;
    const [items, total] = await this.fieldInfoRepository.findAndCount({
      ...query,
      skip: (current - 1) * size,
      take: size,
    });
    return { items, total, current, size };
  }
}

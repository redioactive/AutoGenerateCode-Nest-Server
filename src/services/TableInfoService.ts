
import { Injectable, BadRequestException } from '@nestjs/common';
import { TableInfo } from '../models/entity/TableInfo';
import { TableInfoQueryRequest } from '../models/dto/TableInfoQueryRequest';
import { ReviewStatusEnum } from '../models/enums/ReviewStatusEnum';

@Injectable()
export class TableInfoService {
  // 使用内存数组模拟数据库表记录
  private tableInfos: TableInfo[] = [];
  private idCounter = 1;

  /**
   * 校验并预处理表信息（新增或更新均调用）
   * @param tableInfo 待校验的实体对象
   * @param isNew 是否为新增操作
   */
  async validAndHandleTableInfoAdd(tableInfo: TableInfo, isNew: boolean): Promise<void> {
    if (!tableInfo) {
      throw new BadRequestException('表信息不能为空');
    }
    // 简单示例：校验必填字段
    if (!tableInfo.name || !tableInfo.content) {
      throw new BadRequestException('缺少必要的字段：name或content');
    }
    // 如果是新增，设置默认审核状态（根据业务需要可以修改）
    if (isNew) {
      tableInfo.reviewStatus = ReviewStatusEnum.PASS;
    }
    // 其他预处理逻辑可以在此添加，比如数据格式化、初始化其他字段等
  }

  /**
   * 更新时的校验和处理
   * @param tableInfo 待更新的实体对象
   * @returns 更新后的表信息
   */
  async validAndHandleTableInfoUpdate(tableInfo: TableInfo): Promise<TableInfo> {
    if (!tableInfo || !tableInfo.id || tableInfo.id <= 0) {
      throw new BadRequestException('无效的表信息');
    }
    // 根据 id 查找原记录
    const index = this.tableInfos.findIndex(item => item.id === tableInfo.id);
    if (index === -1) {
      throw new BadRequestException('记录不存在');
    }
    // 示例逻辑：将传入的新属性与原记录合并（实际业务中可有更复杂逻辑）
    this.tableInfos[index] = { ...this.tableInfos[index], ...tableInfo };
    return this.tableInfos[index];
  }

  /**
   * 保存表信息（新增或更新）
   * @param tableInfo 待保存的实体对象
   * @returns 保存成功返回 true，否则 false
   */
  async save(tableInfo: TableInfo): Promise<boolean> {
    if (!tableInfo.id) {
      // 新增记录：分配 id 并保存
      tableInfo.id = this.idCounter++;
      this.tableInfos.push(tableInfo);
      return true;
    } else {
      // 更新记录：查找并替换
      const index = this.tableInfos.findIndex(item => item.id === tableInfo.id);
      if (index !== -1) {
        this.tableInfos[index] = tableInfo;
        return true;
      }
      return false;
    }
  }

  /**
   * 根据 id 获取表信息
   * @param id 表信息 id
   */
  async getById(id: number): Promise<TableInfo | undefined> {
    return this.tableInfos.find(item => item.id === id);
  }

  /**
   * 与 getById 方法等价（用于兼容 Controller 中的 getByid 调用）
   * @param id 表信息 id
   */
  async getByid(id: number): Promise<TableInfo | undefined> {
    return this.getById(id);
  }

  /**
   * 分页查询表信息
   * @param current 当前页码（从 1 开始）
   * @param size 每页记录数
   * @param filter 查询条件（包含 where、order 等条件）
   */
  async page(current: number, size: number, filter: any): Promise<any> {
    let records = [...this.tableInfos];

    // 根据 where 条件进行过滤
    if (filter && filter.where) {
      records = records.filter(item => this.filterRecord(item, filter.where));
    }

    // 根据 order 条件排序
    if (filter && filter.order) {
      const orderKey = Object.keys(filter.order)[0];
      if (orderKey) {
        const direction = filter.order[orderKey];
        records.sort((a, b) => {
          if (a[orderKey] < b[orderKey]) return direction === 1 ? -1 : 1;
          if (a[orderKey] > b[orderKey]) return direction === 1 ? 1 : -1;
          return 0;
        });
      }
    }

    const total = records.length;
    const start = (current - 1) * size;
    const end = start + size;
    const pageRecords = records.slice(start, end);
    return {
      total,
      current,
      size,
      records: pageRecords,
    };
  }

  /**
   * 查询符合条件的全部表信息
   * @param filter 查询条件，可包含 where、order、select（字段过滤）等信息
   */
  async list(filter: any): Promise<TableInfo[]> {
    let records = [...this.tableInfos];

    // 过滤
    if (filter && filter.where) {
      records = records.filter(item => {
        // 如果 where 中有 $or 条件
        if (filter.where.$or && Array.isArray(filter.where.$or)) {
          return filter.where.$or.some(condition => this.filterRecord(item, condition));
        }
        return this.filterRecord(item, filter.where);
      });
    }

    // 排序
    if (filter && filter.order) {
      const orderKey = Object.keys(filter.order)[0];
      if (orderKey) {
        const direction = filter.order[orderKey];
        records.sort((a, b) => {
          if (a[orderKey] < b[orderKey]) return direction === 1 ? -1 : 1;
          if (a[orderKey] > b[orderKey]) return direction === 1 ? 1 : -1;
          return 0;
        });
      }
    }

    // 如果指定了 select 字段，则只返回部分字段
    if (filter && filter.select && Array.isArray(filter.select)) {
      return records.map(item => {
        const projected: any = {};
        filter.select.forEach((field: string) => {
          projected[field] = item[field];
        });
        return projected;
      });
    }

    return records;
  }

  /**
   * 辅助方法：判断一条记录是否满足 where 条件
   * 支持简单的相等比较和正则匹配
   * @param record 单条记录
   * @param where 查询条件对象
   */
  private filterRecord(record: any, where: any): boolean {
    for (const key in where) {
      const condition = where[key];
      if (condition && typeof condition === 'object' && condition.$regex) {
        const regex = new RegExp(condition.$regex, condition.$options);
        if (!regex.test(record[key] ? String(record[key]) : '')) {
          return false;
        }
      } else {
        // 支持直接比较
        if (record[key] !== condition) {
          return false;
        }
      }
    }
    return true;
  }
}

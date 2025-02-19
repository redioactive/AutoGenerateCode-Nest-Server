import * as Handlebars from 'handlebars';
import { Injectable, Logger } from '@nestjs/common';
import { TableSchema, Field } from '../schema/TableSchema';
import { FieldTypeEnum } from '../model/enums/FieldType';
import { NestEntityGenerate } from '../model/dto/NestEntityGenerate';
import { FieldDTO } from '../model/dto/FieldDTO';
import { NestObjectGenerate } from '../model/dto/NestObjectGenerate';
import { BusinessException } from '../../exceptions/BusinessException';
import { ErrorCode } from '../../common/ErrorCode';


/**
 * Nest代码生成器
 * @author https://github.com/redioactive
 * */
@Injectable()
export class NestCodeBuilder {
  private readonly logger = new Logger(NestCodeBuilder.name);

  /**
   * 构建Nest实体代码
   * @param tableSchema 表概要
   * @param 生成的 Nest代码
   * */
  buildNestEntityCode(tableSchema: TableSchema): string {
    const dto: NestEntityGenerate = new NestEntityGenerate();
    const tableName = tableSchema.tableName;
    const tableComment = tableSchema.tableComment;
    const upperCamelTableName = this.toCamelCase(tableName, true);

    dto.className = upperCamelTableName;
    dto.classComment = tableComment || upperCamelTableName;
    dto.fieldList = tableSchema.fieldList.map((field) => {
      const fieldType = FieldTypeEnum[field.fieldType] || FieldTypeEnum.TEXT;
      const fieldDTO: FieldDTO = {
        comment: field.comment,
        NestType: fieldType.nestType,
        fieldName: this.toCamelCase(field.fieldName, false),
        NestFieldName: this.toCamelCase(field.fieldName, false),
        typescript: fieldType.typescript || 'any',
        NestComment: field.comment || '',
        setMethod: `set${this.toCamelCase(field.fieldName, true)}`,
        value: 'null',
      };
      return fieldDTO;
    });
    return this.renderTemplate('nest_entity', dto);
  }

  /**
   * 构建Nest 对象代码
   * */
  buildObjectCode(tableSchema: TableSchema, dataList: Record<string, any>[]): string {
    const dto: NestObjectGenerate = new NestObjectGenerate();
    const className = this.toCamelCase(tableSchema.tableName, true);
    const objectName = this.toCamelCase(tableSchema.tableName, false);

    dto.className = className;
    dto.objectName = objectName;

    dto.fieldList = tableSchema.fieldList.map((field) => {
      return {
        fieldName: this.toCamelCase(field.fieldName, false),  // 驼峰命名
        NestFieldName: this.toCamelCase(field.fieldName, false),
        typescript: FieldTypeEnum[field.fieldType]?.typescript || 'any', // 确保类型
        NestType: FieldTypeEnum[field.fieldType]?.nestType || 'string', // 确保 Nest 类型
        comment: field.comment || '', // 处理可能为空的注释
        NestComment: field.comment || '',
        setMethod: `set${this.toCamelCase(field.fieldName, true)}`,
        value: this.getValueStr(field, dataList[0]?.[field.fieldName] ?? ''),
      };
    });
    return this.renderTemplate('nest_entity', dto);
  }

  /**
   * 获取字段的值字符串
   * @param field 字段信息
   * @param value 值
   * @returns 格式化后的值字符串
   * */
  private getValueStr(field: Field, value: any): string {
    if (!field || value == null) return '\'\'';
    const type = FieldTypeEnum[field.fieldType] || FieldTypeEnum.TEXT;
    if (['DATE', 'TIME', 'DEFAULT', 'CHAR', 'VARCHAR', 'TEXT'].includes(type)) {
      return `"${value}"`;
    }
    return `${value}`;
  }

  /**
   * 渲染 Handlebars 模板
   * @param templateName 模板名称
   * @param data 数据对象
   * @returns 生成的 Nest 代码
   */
  private renderTemplate(templateName: string, data: any): string {
    try {
      // 这里假设模板是提前加载到内存中的
      const templateString = this.loadTemplate(templateName);
      const template = Handlebars.compile(templateString);
      return template(data);
    } catch (error) {
      this.logger.error(`模板渲染失败: ${error.message}`);
      throw new BusinessException(ErrorCode.OPERATION_ERROR.code, 'Nest 代码生成失败');
    }
  }

  /**
   * 加载 Handlebars 模板
   * @param templateName 模板名称
   * @returns 模板内容
   */
  private loadTemplate(templateName: string): string {
    // 这里可以从文件系统或数据库加载模板
    const templates = {
      nest_entity: `public class {{className}} {
        {{#each fieldList}}
        private {{nestType}} {{fieldName}}; // {{comment}}
        {{/each}}
      }`,
      nest_object: `{{className}} {{objectName}} = new {{className}}();
      {{#each fieldList}}
      {{objectName}}.{{setMethod}}({{value}});
      {{/each}}`,
    };
    return templates[templateName] || '';
  }

  /**
   * 转换为驼峰命名法
   * @param str 输入字符串
   * @param capitalizeFirst 是否首字母大写
   * @returns 驼峰格式字符串
   */
  private toCamelCase(str: string, capitalizeFirst: boolean): string {
    return str
      .replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace('-', '').replace('_', ''))
      .replace(/^./, (char) => (capitalizeFirst ? char.toUpperCase() : char.toLowerCase()));
  }

}
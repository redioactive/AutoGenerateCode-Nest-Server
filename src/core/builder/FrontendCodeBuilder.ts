import {Injectable,InternalServerErrorException,Inject} from '@nestjs/common';
import {ModuleRef} from "@nestjs/core";
import {ConfigurationService} from '../../services/ConfigurationService';
import {TableSchema,Field} from '../schema/TableSchema';
import {TypeScriptTypeGenerate} from '../model/dto/TypescriptTypeGenerate';
import {FieldDTO} from '../model/dto/FieldDTO';
import {toCamelCase} from '../utils/StringUtils';
import { FieldTypeEnum } from '../model/enums/FieldType';

@Injectable()
export class FrontendCodeBuilder {
  constructor(private readonly configuration:ConfigurationService) {}

  /**
   * 使用NestJS 模块引用获取 FrontendCodeBuilder 实例
   * */
  static async buildTypeScriptCodeStatic(
    moduleRef:ModuleRef,
    tableSchema:TableSchema,
  ):Promise<string> {
    const frontendCodeBuilder = moduleRef.get(FrontendCodeBuilder,{strict:true});
    return frontendCodeBuilder.buildTypeScriptTypeCode(tableSchema);
  }
  /**
   * 首字母大写
   * */
  private capitalize(str:string):string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  /**
   * 构造Typescript 类型代码
   * @param tableSchema 表概要
   * @return 生成的代码字符串
   * */
  async buildTypeScriptTypeCode(tableSchema:TableSchema):Promise<string> {
    try {
      //传递参数
      const generateDTO:TypeScriptTypeGenerate = new TypeScriptTypeGenerate();
      const tableName = tableSchema.tableName;
      const tableComment = tableSchema.tableComment;
      const upperCamelTableName = this.capitalize(toCamelCase(tableName));

      //类名
      generateDTO.className = upperCamelTableName;
      //类注释
      generateDTO.className = tableComment || upperCamelTableName;

      //处理字段列表
      const fieldDTOList:FieldDTO[] = tableSchema.fieldList.map((field:Field) => {
        const fieldTypeEnum = FieldTypeEnum[field.fieldType] || FieldTypeEnum.TEXT;
        return {
          comment: field.comment || '',
          typescript: fieldTypeEnum.typescriptType, // 修正为正确的属性
          fieldName: toCamelCase(field.fieldName),
          NestFieldName: toCamelCase(field.fieldName), // 这里可以根据实际需求修改
          NestType: fieldTypeEnum.nestType || 'any', // 确保 nestType 存在
          NestComment: field.comment || '',
          setMethod: `set${toCamelCase(field.fieldName, true)}`, // 生成 set 方法名
          value: 'defaultValue' // 你可以根据需求填充实际值
        }
      });
      generateDTO.fieldList = fieldDTOList;

      //处理模板
      const template = await this.configuration.getTemplate('typescript_type.ftl');
      return template.render(generateDTO);
    }catch(error) {
      throw new InternalServerErrorException('Failed to generate Typescript type code');
    }
  }

}
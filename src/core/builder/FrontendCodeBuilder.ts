import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {TableSchema} from "../schema/TableSchema";
import {Field} from "../schema/TableSchema";
import {toCamelCase} from "../utils/StringUtils";
import {FieldTypeEnum} from "../model/enums/FieldType";

type FieldTypeMapping = {
  [key: string]: string;
};

type TemplateData = {
  className: string;
  classComment: string;
  fieldList: Array<{
    fieldName: string;
    typescriptType: string;
    comment?: string;
  }>;
};

@Injectable()
export class FrontendCodeBuilder {
  private readonly fieldTypeMap: FieldTypeMapping = {
    'text': 'string',
    'int': 'number',
    'bigint': 'number',
    'float': 'number',
    'double': 'number',
    'decimal': 'number',
    'boolean': 'boolean',
    'date': 'Date',
    'datetime': 'Date',
    'timestamp': 'number',
    'json': 'any',
  };

  private readonly template = `
{{classComment}}
interface {{className}} {
{{#each fieldList}}
  /** {{comment}} */
  {{fieldName}}: {{typescriptType}};
{{/each}}
}`;

  buildTypeScriptTypeCode(tableSchema: TableSchema): string {
    try {
      const templateData = this.prepareTemplateData(tableSchema);
      return this.renderTemplate(templateData);
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate TypeScript type code', {
        cause: error,
      });
    }
  }

  private prepareTemplateData(tableSchema: TableSchema): TemplateData {
    const className = this.toUpperCamelCase(tableSchema.tableName);

    // return {
    //   className,
    //   classComment: this.generateClassComment(tableSchema.tableComment, className),
    //   fieldList: tableSchema.fieldList.map(field => ({
    //     fieldName: this.toCamelCase(field.fieldName),
    //     typescriptType: this.mapFieldType(field.fieldType),
    //     comment: field.comment,
    //   })),
    // };
    return {
      className,
      classComment: this.generateClassComment(tableSchema.tableComment, className),
      fieldList: tableSchema.fieldList
          .map(field => {
            const fieldName = this.toCamelCase(field.fieldName);
            // 过滤无效字段名
            if (!fieldName) {
              throw new Error(`Invalid field name: ${field.fieldName}`);
            }
            return {
              fieldName,
              typescriptType: this.mapFieldType(field.fieldType),
              comment: field.comment?.trim() // 去除前后空格
            };
          })
          // 过滤空字段名
          .filter(field => !!field.fieldName)
    };
  }

  private renderTemplate(data: TemplateData): string {
    return this.template
        .replace('{{classComment}}', this.formatComment(data.classComment))
        .replace('{{className}}', data.className)
        .replace(
            '{{#each fieldList}}',
            data.fieldList
                .map(field => this.renderField(field))
                .join('\n')
        )
        .replace(/{{[^}]+}}/g, ''); // 清理未使用的占位符
  }

  private renderField(field: TemplateData['fieldList'][0]): string {
    const commentLine = field.comment
        ? `  /** ${field.comment} */` : '';

    const typeLine = `  ${field.fieldName}: ${field.typescriptType};`;

    return [commentLine, typeLine]
        .filter(line => line) // 过滤空行
        .join('\n');
  }

  // private renderField(field: TemplateData['fieldList'][0]): string {
  //   return [
  //     `  /** ${field.comment || ''} */`,
  //     `  ${field.fieldName}: ${field.typescriptType};`,
  //   ].join('\n');
  // }

  private mapFieldType(fieldType: string): string {
    return this.fieldTypeMap[fieldType.toLowerCase()] || 'any';
  }

  private toUpperCamelCase(str: string): string {
    return this.capitalize(this.toCamelCase(str));
  }

  private toCamelCase(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private generateClassComment(comment?: string, fallback: string = ''): string {
    return comment ? `/** ${comment} */` : '';
  }

  private formatComment(comment: string): string {
    return comment ? `${comment}\n` : '';
  }
}
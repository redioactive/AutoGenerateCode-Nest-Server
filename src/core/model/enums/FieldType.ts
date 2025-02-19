import { Injectable } from '@nestjs/common';

/**
 * 字段类型枚举
 */
export enum FieldTypeEnum {
  TINYINT = 'tinyint',
  SMALLINT = 'smallint',
  MEDIUMINT = 'mediumint',
  INT = 'int',
  BIGINT = 'bigint',
  FLOAT = 'float',
  DOUBLE = 'double',
  DECIMAL = 'decimal',
  DATE = 'date',
  TIME = 'time',
  YEAR = 'year',
  DATETIME = 'datetime',
  TIMESTAMP = 'timestamp',
  CHAR = 'char',
  VARCHAR = 'varchar',
  TINYTEXT = 'tinytext',
  TEXT = 'text',
  MEDIUMTEXT = 'mediumtext',
  LONGTEXT = 'longtext',
  TINYBLOB = 'tinyblob',
  BLOB = 'blob',
  MEDIUMBLOB = 'mediumblob',
  LONGBLOB = 'longblob',
  BINARY = 'binary',
  VARBINARY = 'varbinary',
}

/**
 * 枚举属性接口
 */
export interface FieldTypeInfo {
  value: FieldTypeEnum;
  javaType: string;
  typescriptType: string;
}

/**
 * FieldTypeEnum 属性映射
 */
export const FieldTypeEnumMap: Record<FieldTypeEnum, FieldTypeInfo> = {
  [FieldTypeEnum.TINYINT]: { value: FieldTypeEnum.TINYINT, javaType: 'Integer', typescriptType: 'number' },
  [FieldTypeEnum.SMALLINT]: { value: FieldTypeEnum.SMALLINT, javaType: 'Integer', typescriptType: 'number' },
  [FieldTypeEnum.MEDIUMINT]: { value: FieldTypeEnum.MEDIUMINT, javaType: 'Integer', typescriptType: 'number' },
  [FieldTypeEnum.INT]: { value: FieldTypeEnum.INT, javaType: 'Integer', typescriptType: 'number' },
  [FieldTypeEnum.BIGINT]: { value: FieldTypeEnum.BIGINT, javaType: 'Long', typescriptType: 'number' },
  [FieldTypeEnum.FLOAT]: { value: FieldTypeEnum.FLOAT, javaType: 'Double', typescriptType: 'number' },
  [FieldTypeEnum.DOUBLE]: { value: FieldTypeEnum.DOUBLE, javaType: 'Double', typescriptType: 'number' },
  [FieldTypeEnum.DECIMAL]: { value: FieldTypeEnum.DECIMAL, javaType: 'BigDecimal', typescriptType: 'number' },
  [FieldTypeEnum.DATE]: { value: FieldTypeEnum.DATE, javaType: 'Date', typescriptType: 'Date' },
  [FieldTypeEnum.TIME]: { value: FieldTypeEnum.TIME, javaType: 'Time', typescriptType: 'Date' },
  [FieldTypeEnum.YEAR]: { value: FieldTypeEnum.YEAR, javaType: 'Integer', typescriptType: 'number' },
  [FieldTypeEnum.DATETIME]: { value: FieldTypeEnum.DATETIME, javaType: 'Date', typescriptType: 'Date' },
  [FieldTypeEnum.TIMESTAMP]: { value: FieldTypeEnum.TIMESTAMP, javaType: 'Long', typescriptType: 'number' },
  [FieldTypeEnum.CHAR]: { value: FieldTypeEnum.CHAR, javaType: 'String', typescriptType: 'string' },
  [FieldTypeEnum.VARCHAR]: { value: FieldTypeEnum.VARCHAR, javaType: 'String', typescriptType: 'string' },
  [FieldTypeEnum.TINYTEXT]: { value: FieldTypeEnum.TINYTEXT, javaType: 'String', typescriptType: 'string' },
  [FieldTypeEnum.TEXT]: { value: FieldTypeEnum.TEXT, javaType: 'String', typescriptType: 'string' },
  [FieldTypeEnum.MEDIUMTEXT]: { value: FieldTypeEnum.MEDIUMTEXT, javaType: 'String', typescriptType: 'string' },
  [FieldTypeEnum.LONGTEXT]: { value: FieldTypeEnum.LONGTEXT, javaType: 'String', typescriptType: 'string' },
  [FieldTypeEnum.TINYBLOB]: { value: FieldTypeEnum.TINYBLOB, javaType: 'byte[]', typescriptType: 'string' },
  [FieldTypeEnum.BLOB]: { value: FieldTypeEnum.BLOB, javaType: 'byte[]', typescriptType: 'string' },
  [FieldTypeEnum.MEDIUMBLOB]: { value: FieldTypeEnum.MEDIUMBLOB, javaType: 'byte[]', typescriptType: 'string' },
  [FieldTypeEnum.LONGBLOB]: { value: FieldTypeEnum.LONGBLOB, javaType: 'byte[]', typescriptType: 'string' },
  [FieldTypeEnum.BINARY]: { value: FieldTypeEnum.BINARY, javaType: 'byte[]', typescriptType: 'string' },
  [FieldTypeEnum.VARBINARY]: { value: FieldTypeEnum.VARBINARY, javaType: 'byte[]', typescriptType: 'string' },
};

/**
 * 提供 FieldTypeEnum 服务
 */
@Injectable()
export class FieldTypeService {
  /**
   * 获取所有字段类型值列表
   */
  getValues(): string[] {
    return Object.values(FieldTypeEnum);
  }

  /**
   * 根据值获取对应的枚举项
   * @param value 字段值
   * @returns FieldTypeInfo 或 null
   */
  getEnumByValue(value: string): FieldTypeInfo | null {
    if (!value) {
      return null;
    }
    const fieldType = Object.values(FieldTypeEnum).find((type) => type === value);
    return fieldType ? FieldTypeEnumMap[fieldType] : null;
  }

  /**
   * 获取字段的 Java 类型
   * @param value 字段值
   */
  getJavaType(value: string): string | null {
    return this.getEnumByValue(value)?.javaType || null;
  }

  /**
   * 获取字段的 TypeScript 类型
   * @param value 字段值
   */
  getTypescriptType(value: string): string | null {
    return this.getEnumByValue(value)?.typescriptType || null;
  }
}

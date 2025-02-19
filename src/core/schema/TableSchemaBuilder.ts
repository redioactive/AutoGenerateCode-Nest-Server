import { Injectable, Logger } from '@nestjs/common';
import { BusinessException } from '../../exceptions/BusinessException';
import { ErrorCode } from '../../common/ErrorCode';
import { TableSchema, Field } from './TableSchema'; // 请确保 TableSchema 的定义已转换为 TypeScript
import { FieldInfo } from '../../models/entity/FieldInfo';
import { FieldInfoService } from '../../services/FieldInfoService';
import { MySQLDialect } from '../builder/sql/MySQLDialect';
import { MockTypeEnum } from '../model/enums/MockTypeEnum';
import { FieldTypeEnum } from '../model/enums/FieldType';
import * as ExcelJS from 'exceljs';
import { parse, isValid } from 'date-fns';
import { Parser } from 'node-sql-parser';
import { In } from 'typeorm';

@Injectable()
export class TableSchemaBuilder {
  private readonly logger = new Logger(TableSchemaBuilder.name);
  // 静态保存 fieldInfoService 以供静态方法使用
  private static fieldInfoService: FieldInfoService;
  private static readonly sqlDialect = new MySQLDialect();
  // 日期格式数组
  private static readonly DATE_PATTERNS = [
    'yyyy-MM-dd',
    'yyyy年MM月dd日',
    'yyyy-MM-dd HH:mm:ss',
    'yyyy-MM-dd HH:mm',
    'yyyy/MM/dd',
    'yyyy/MM/dd HH:mm:ss',
    'yyyy/MM/dd HH:mm',
    'yyyyMMdd',
  ];

  constructor(private readonly fieldInfoServiceInstance: FieldInfoService) {
    // 通过构造函数注入的 service 赋值给静态成员，以供静态方法使用
    TableSchemaBuilder.fieldInfoService = fieldInfoServiceInstance;
  }
  /**
   * 根据自动匹配文本生成表结构
   * @param content 以逗号分隔的单词字符串
   */
  public static async buildFromAuto(content: string): Promise<TableSchema> {
    if (!content || content.trim() === '') {
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code);
    }
    // 按逗号或中文逗号分割，并过滤空串
    const words = content.split(/[,，]/).map(w => w.trim()).filter(w => w !== '');
    if (words.length === 0 || words.length > 20) {
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code);
    }
    // 构造查询条件（示例中使用类似 MongoDB 的查询对象）
    const query = {
      where: [
        { name: In(words) },         // name IN (words)
        { fieldName: In(words) },     // OR fieldName IN (words)
      ],
    };
    // 查询匹配的 FieldInfo 列表（假设 fieldInfoService.list(query) 返回 Promise<FieldInfo[]>）
    const fieldInfoList: FieldInfo[] = await TableSchemaBuilder.fieldInfoService.list(query);
    // 分组：名称 => FieldInfo[]
    const nameFieldInfoMap = fieldInfoList.reduce((map, info) => {
      (map[info.name] = map[info.name] || []).push(info);
      return map;
    }, {} as Record<string, FieldInfo[]>);
    // 分组：字段名 => FieldInfo[]
    const fieldNameFieldInfoMap = fieldInfoList.reduce((map, info) => {
      (map[info.fieldName] = map[info.fieldName] || []).push(info);
      return map;
    }, {} as Record<string, FieldInfo[]>);

    const tableSchema = new TableSchema();
    tableSchema.tableName = 'my_table';
    tableSchema.tableComment = '自动生成的表';
    const fieldList: Field[] = [];
    for (const word of words) {
      let field: Field;
      const infoList = nameFieldInfoMap[word] || fieldNameFieldInfoMap[word];
      if (infoList && infoList.length > 0) {
        try {
          // 假设 infoList[0].content 为 JSON 字符串，转换为 Field 对象
          field = JSON.parse(infoList[0].content) as Field;
        } catch (error) {
          field = TableSchemaBuilder.getDefaultField(word);
        }
      } else {
        field = TableSchemaBuilder.getDefaultField(word);
      }
      fieldList.push(field);
    }
    tableSchema.fieldList = fieldList;
    return tableSchema;
  }

  /**
   * 根据建表 SQL 语句构建 TableSchema（使用 node-sql-parser 解析）
   * @param sql 建表 SQL 语句
   */
  public static buildFromSql(sql: string): TableSchema {
    if (!sql || sql.trim() === '') {
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code);
    }
    try {
      const parser = new Parser();
      // 解析 SQL（指定 MySQL 方言）
      const ast = parser.astify(sql, { database: 'MySQL' }) as any; // 类型使用 any 简化处理

      const tableSchema = new TableSchema();
      // 解析表信息：假设 ast.table 为数组，取第一个对象
      const tableInfo = ast.table && ast.table[0];
      tableSchema.dbName = tableInfo ? tableInfo.db || '' : '';
      tableSchema.tableName = tableInfo ? TableSchemaBuilder.sqlDialect.parseTableName(tableInfo.table) : '';
      // 提取表注释：部分 SQL 解析器会把表注释存放在 ast.options.comment 中
      let tableComment = '';
      if (ast.options && ast.options.comment) {
        tableComment = ast.options.comment;
        if (tableComment.length > 2) {
          tableComment = tableComment.substring(1, tableComment.length - 1);
        }
      }
      tableSchema.tableComment = tableComment;

      const fieldList: Field[] = [];
      if (ast.create_definitions && Array.isArray(ast.create_definitions)) {
        for (const def of ast.create_definitions) {
          if (def.resource === 'constraint' && def.constraint_type.toLowerCase() === 'primary key') {
            // 处理主键约束
            const primaryColumns: string[] = def.definition.index_columns.map((col: any) => col.column);
            // 遍历已有字段，标记主键
            fieldList.forEach(field => {
              if (primaryColumns.includes(field.fieldName)) {
                field.primaryKey = true;
              }
            });
          } else if (def.resource === 'column') {
            // 处理列定义
            const columnName = def.column;
            const definition = def.definition;
            const field: Field = {
              fieldName: TableSchemaBuilder.sqlDialect.parseFieldName(columnName),
              fieldType: definition.dataType ? definition.dataType.type : '',
              defaultValue: definition.default || null,
              notNull: !!definition.notNull,
              // 处理注释，去除单引号
              comment: definition.comment ? definition.comment.replace(/^'(.*)'$/, '$1') : null,
              primaryKey: !!definition.primaryKey, // 若主键约束在单独定义中，该值可能为 false
              autoIncrement: !!definition.auto_increment,
              mockType: MockTypeEnum.NONE, // 默认模拟类型
              mockParams: '',
              onUpdate: definition.onUpdate || '',
            };
            fieldList.push(field);
          }
        }
      }
      tableSchema.fieldList = fieldList;
      return tableSchema;
    } catch (error) {
      Logger.error('SQL 解析错误', error);
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code, '请确认 SQL 语句正确');
    }
  }

  /**
   * 根据 Excel 文件构建 TableSchema
   * @param file Excel 文件（Express.Multer.File 类型）
   */
  public static async buildFromExcel(file:Express.Multer.File): Promise<TableSchema> {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.buffer);
      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new BusinessException(ErrorCode.PARAMS_ERROR.code, '表格无数据');
      }
      // 读取所有行数据，每行转换为字符串数组
      const dataList: string[][] = [];
      worksheet.eachRow((row) => {
        // ExcelJS 中 row.values 数组第一个元素可能为 null
        const rowData = row.values as string[];
        if (rowData[0] == null) {
          rowData.shift();
        }
        dataList.push(rowData);
      });
      if (dataList.length === 0) {
        throw new BusinessException(ErrorCode.PARAMS_ERROR.code, '表格无数据');
      }
      // 第一行作为表头
      const headerRow = dataList[0];
      const fieldList: Field[] = headerRow.map((name: string) => ({
        fieldName: name,
        comment: name,
        fieldType: FieldTypeEnum.TEXT, // 默认类型为 TEXT
        defaultValue: '',
        notNull: false,
        primaryKey: false,
        autoIncrement: false,
        mockType: '',
        mockParams: '',
        onUpdate: '',
      }));
      // 如果存在第二行数据，则根据值判断字段类型
      if (dataList.length > 1) {
        const secondRow = dataList[1];
        for (let i = 0; i < fieldList.length; i++) {
          const value = secondRow[i];
          const fieldType = TableSchemaBuilder.getFieldTypeByValue(value);
          fieldList[i].fieldType = fieldType;
        }
      }
      const tableSchema = new TableSchema();
      tableSchema.fieldList = fieldList;
      return tableSchema;
    } catch (error) {
      Logger.error('buildFromExcel error', error);
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code, '表格解析错误');
    }
  }

  /**
   * 根据值判断字段类型
   * @param value 字段值
   */
  public static getFieldTypeByValue(value: string): string {
    if (!value || value.trim() === '') {
      return FieldTypeEnum.TEXT;
    }
    // 布尔类型
    if (value.toLowerCase() === 'false' || value.toLowerCase() === 'true') {
      return FieldTypeEnum.TINYINT;
    }
    // 整数类型
    if (/^\d+$/.test(value)) {
      const numberValue = parseInt(value, 10);
      if (numberValue > Number.MAX_SAFE_INTEGER) {
        return FieldTypeEnum.BIGINT;
      }
      return FieldTypeEnum.INT;
    }
    // 小数类型
    if (TableSchemaBuilder.isDouble(value)) {
      return FieldTypeEnum.DOUBLE;
    }
    // 日期类型
    if (TableSchemaBuilder.isDate(value)) {
      return FieldTypeEnum.DATETIME;
    }
    return FieldTypeEnum.TEXT;
  }

  /**
   * 判断字符串是否为 double 型
   * @param str 字符串
   */
  private static isDouble(str: string): boolean {
    const pattern = /^[0-9]+(\.[0-9]*)?[dD]?$/;
    return pattern.test(str);
  }

  /**
   * 判断字符串是否为日期格式
   * @param str 字符串
   */
  private static isDate(str: string): boolean {
    if (!str || str.trim() === '') {
      return false;
    }
    for (const pattern of TableSchemaBuilder.DATE_PATTERNS) {
      const parsedDate = parse(str, pattern, new Date());
      if (isValid(parsedDate)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 获取默认字段（未匹配到词库时使用）
   * @param word 单词
   */
  private static getDefaultField(word: string): Field {
    return {
      fieldName: word,
      fieldType: FieldTypeEnum.TEXT,
      defaultValue: '',
      notNull: false,
      comment: word,
      primaryKey: false,
      autoIncrement: false,
      mockType: '',
      mockParams: '',
      onUpdate: '',
    };
  }
}

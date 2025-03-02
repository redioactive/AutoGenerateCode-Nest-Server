import {Controller, Post, Body, Res, HttpStatus, HttpException} from '@nestjs/common';
import { Response } from 'express';
import { Workbook } from 'exceljs';
import { BaseResponse } from '../common/BseResponse.dto';
import { ResultUtilsDto } from '../common/ResultUtils.dto';
import { GeneratorFacade } from '../core/GeneratorFacade';
import { GenerateVO } from '../core/model/vo/GenerateVO';
import { TableSchema } from '../core/schema/TableSchema';
import { TableSchemaBuilder } from '../core/schema/TableSchemaBuilder';
import { BusinessException } from '../exceptions/BusinessException';
import { ErrorCode } from '../common/ErrorCode';
import { GenerateByAutoRequest } from '../models/dto/GenerateByAutoRequest';
import { GenerateBySqlRequest } from '../models/dto/GenerateBySqlRequest';

@Controller('sql')
export class SqlController {
  /**
   * 根据表结构生成所有数据
   * @param tableSchema 表结构对象
   * @returns 生成结果
   * */
  @Post('generate/schema')
  async generateBySchema(@Body() tableSchema: TableSchema): Promise<BaseResponse<GenerateVO>> {
    try {
      const result = GeneratorFacade.generateAll(tableSchema);
      return ResultUtilsDto.success(result);
    }catch(error) {
      console.error(`无法生成 schema:${error.message}`)
      throw new HttpException({
        message:'无法生成 schema',
        error:error.message,
        stack:error.stack,
        tableSchemaL:JSON.stringify(tableSchema)
      },HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * 根据自动获取的内容生成表结构
   * @param autoRequest 自动请求对象
   * @returns 表结构
   * */
  @Post('get/schema/auto')
  async getSchemaByAuto(@Body() autoRequest: GenerateByAutoRequest): Promise<BaseResponse<Promise<TableSchema>>> {
    if (!autoRequest) {
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code);
    }
    const tableSchema = TableSchemaBuilder.buildFromAuto(autoRequest.content);
    return ResultUtilsDto.success(tableSchema);
  }

  /**
   * 根据SQL 获取表结构
   * @param sqlRequest SQL请求对象
   * @returns 表结构
   * */
  @Post('get/schema/sql')
  async getSchemaBySql(@Body() sqlRequest: GenerateBySqlRequest): Promise<BaseResponse<TableSchema>> {
    if (!sqlRequest) {
      throw new BusinessException(ErrorCode.PARAMS_ERROR.code);
    }
    const tableSchema = TableSchemaBuilder.buildFromSql(sqlRequest.sql);
    return ResultUtilsDto.success(tableSchema);
  }

  /**
   * 根据上传的 Excel 文件获取表结构
   * @returns 表结构
   * @param generateVO
   * @param response
   * */
  @Post('download/data/excel')
  async downloadDataExcel(@Body() generateVO: GenerateVO, @Res() response: Response): Promise<void> {
    const tableSchema: TableSchema = generateVO.tableSchema;
    const tableName: string = tableSchema.tableName;
    try {
      // 设置响应头，防止中文乱码
      response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      response.setHeader('Content-Encoding', 'utf-8');
      // encodeURIComponent 可防止中文乱码
      const fileName = encodeURIComponent(`${tableName}表数据`).replace(/\+/g, '%20');
      response.setHeader('Content-Disposition', `attachment;filename*=utf-8''${fileName}.xlsx`);
      response.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

      // 使用 exceljs 创建 Excel 文件
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet(`${tableName}表`);

      // 设置表头
      // 假设 tableSchema.fieldList 是一个包含 fieldName 属性的数组
      const columns = tableSchema.fieldList.map((field) => ({
        header: field.fieldName,
        key: field.fieldName,
        width: 20,
      }));
      worksheet.columns = columns;

      // 添加数据行
      // 假设 generateVO.dataList 为一个数组，每一项是一个对象，键与字段名对应
      generateVO.dataList.forEach((data) => {
        worksheet.addRow(data);
      });

      // 将工作簿写入响应流
      await workbook.xlsx.write(response);
      response.end();
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR);
      response.send('下载失败');
      throw new BusinessException(ErrorCode.SYSTEM_ERROR.code, '下载失败');
    }
  }
}
import {Logger} from '@nestjs/common';

/**
 * 数据 JSON 生成器
 * @author https://github.com/redioactive*/
export class JsonBuilder {
  private static readonly logger = new Logger(JsonBuilder.name);

  /**
   * 构造数据 JSON
   * e.g [{"id":1}]
   * @param dataList 数据列表
   * @returns 生成的 JSON字符串
   * */
  static buildJson(dataList:Record<string,any>):string {
    try {
      return JSON.stringify(dataList,null,2); //美化输出
    }catch(error) {
      this.logger.error(`JSON生成失败${error}`)
      return '[]'
    }
  }
}
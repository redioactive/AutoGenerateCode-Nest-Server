import {Injectable} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Mustache from 'mustache';

@Injectable()
export class MustacheConfigurationConfig {
  private readonly templateDir:string;
  constructor() {
    this.templateDir = path.join(__dirname,'../resource/template')
  }
  /**
   * 渲染模板
   * @param templateName 模板名称 (如 template.mustache)
   * @param data 渲染数据对象
   * @returns 渲染后的字符串
   * */
  async renderTemplate(templateName:string,data:Record<string,any>):Promise<string>{
    const templatePath = path.join(this.templateDir,templateName);

    try {
      //读取模板内容
      const template = await fs.promises.readFile(templatePath,'utf8');

      //使用Mustache 渲染模板
      return Mustache.render(template,data)
    }catch(error) {
      console.error(`Error rendering template:${templatePath}`,error);
      throw new Error(`Failed to render template:${templateName}`)
    }
  }
}

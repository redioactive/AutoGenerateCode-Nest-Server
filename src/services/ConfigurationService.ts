import { Injectable } from '@nestjs/common';
import * as freemarker from 'freemarker';

@Injectable()
export class ConfigurationService {
  private readonly configuration: freemarker.Configuration;

  constructor() {
    this.configuration = new freemarker.Configuration({
      templateLoader: new freemarker.ClassTemplateLoader(__dirname + '/../templates'),
    });
  }

  getTemplate(name: string) {
    return this.configuration.getTemplate(name);
  }
}

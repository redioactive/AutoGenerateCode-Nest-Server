import {DocumentBuilder,SwaggerModule} from '@nestjs/swagger';
import {INestApplication} from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('sql-dev')
    .setDescription('sql-dev API文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api-docs',app,document); //访问路径为http://localhost:3000/api-docs
}
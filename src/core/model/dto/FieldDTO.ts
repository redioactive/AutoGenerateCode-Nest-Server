import { ApiProperty } from '@nestjs/swagger';

export class FieldDTO {
  @ApiProperty({ description: '字段名' })
  fieldName: string;

  @ApiProperty({ description: 'Typescript 类型' })
  typescript: string = 'string';

  @ApiProperty({ description: '字段注释' })
  comment: string;

  @ApiProperty({ description: 'Nest 字段名' })
  NestFieldName: string;

  @ApiProperty({ description: 'Nest 类型' })
  NestType: string = 'string';

  @ApiProperty({ description: 'Nest 注释(字段中文名)' })
  NestComment: string;

  @ApiProperty({ description: 'set 方法', required: false })
  setMethod?: string;

  @ApiProperty({ description: '值', required: false })
  value?: string = '""';
}

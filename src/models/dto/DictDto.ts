import {ApiProperty} from '@nestjs/swagger';

export class CreateDicDto {
  @ApiProperty({description:'词条名称'})
  name:string;

  @ApiProperty({description:'词条内容'})
  content:string;
}

export class UpdateDicDto {
  @ApiProperty({description:'字条ID'})
  id:number;

  @ApiProperty({description:'词条内容'})
  content?:string;
}

export class QueryDictDto {
  @ApiProperty({description:'页码',example:1})
  current?:number = 1;

  @ApiProperty({description:'每页大小',example:10})
  pageSize?:number = 1;

  @ApiProperty({description:'排序字段'})
  sortField?:string;

  @ApiProperty({description:'排序方式(asc/desc)'})
  sortOrder?:string;
}

export class DeleteDicDto {
  @ApiProperty({description:'词条ID'})
  id:number
}
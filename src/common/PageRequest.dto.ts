import {ApiProperty} from '@nestjs/swagger'
import {IsOptional,IsString,IsNumber,Min} from 'class-validator'
import {Transform} from 'class-transformer'
import {CommonConstants} from '../constants/Common_Constant';

/**
 * 分页请求 DTO
 * @author https://github/redioactive*/

export class PageRequestDto {
  @ApiProperty({description:'当前页号,example:1,required:false'})
  @IsNumber()
  @Min(1,{message:'当前页号必须大于等于1'})
  @Transform(({value}) => parseInt(value, 10) || 1)
  current:number = 1;

  @ApiProperty({description:'页面大小',example:10,required:false})
  @IsNumber()
  @Min(1,{message:'页面大小必须大于等于1'})
  @Transform(({value}) => parseInt(value, 10) || 10) //默认值为10
  pageSize:number = 10;

  @ApiProperty({description:'排序字段',example:'createTime',required:false})
  @IsOptional()
  @IsString()
  sortField?:string;

  @ApiProperty({description:'排序顺序(asc或desc)',example:'asc',required:false})
  @IsOptional()
  @IsString()
  sortOrder:string = CommonConstants.SORT_ORDER_ASC;
}
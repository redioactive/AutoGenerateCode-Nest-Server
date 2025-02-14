import {IsNotEmpty,IsNumber} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

/**
 * 删除请求DTO
 * @author https://github.com/redioactive*/

export class DeleteRequestDto {
  @ApiProperty({
    description: '要删除的实体 ID',
    example:1
  })
  @IsNotEmpty({message:'ID不能为空'})
  @IsNumber({},{message:'ID必须是数字类型'})
  id:number
}
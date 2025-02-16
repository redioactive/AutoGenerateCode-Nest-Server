import {ApiProperty} from '@nestjs/swagger';

export class UserVO {
  @ApiProperty({description: "用户 ID"})
  id:number;

  @ApiProperty({description:'用户昵称'})
  userName:string;

  @ApiProperty({description:'账号'})
  userAccount:string;

  @ApiProperty({description:'性别（0-未知），1-男，2-女',example:1})
  gender:number;

  @ApiProperty({description:'用户角色（user/admin）'})
  userRole:string;

  @ApiProperty({description:'创建时间'})
  createTime:Date;

  @ApiProperty({description:'更新时间'})
  updateTime:Date;
}
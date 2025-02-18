import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../services/UserService';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }
}

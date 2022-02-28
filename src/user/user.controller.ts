import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  @ApiBearerAuth('JWT')
  @Get()
  getHello(): string {
    return 'Hello World! Users';
  }
}

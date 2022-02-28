import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/user/is-public.decorator';
import { AuthService } from './auth.service';
import LoginDataDTO from './types/loginData.dto';

@IsPublic()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async login(@Body() loginData: LoginDataDTO) {
    const { email, password } = loginData;
    return this.authService.login(email, password);
  }
}

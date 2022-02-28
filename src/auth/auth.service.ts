import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(email: string, password: string) {
    const [user] = await this.userService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException();
    if (await bcrypt.compare(password, user.password)) {
      const payload = { email, sub: user.id };
      return {
        token: this.jwtService.sign(payload),
      };
    } else throw new UnauthorizedException();
  }
}

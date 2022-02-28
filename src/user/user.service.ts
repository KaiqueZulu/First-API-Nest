import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserDTO from './types/user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async createUser(user: UserDTO) {
    const encryptPassword = await this.encryptPassword(user.password);
    const userEntity = this.userRepository.create({
      ...user,
      password: encryptPassword,
    });
    return this.userRepository.save(userEntity);
  }
  async verifyUserExists(email, cpf) {
    const foundUserByEmail = await this.findUserByEmail(email);
    const foundUserByCpf = await this.findUserByCpf(cpf);

    return foundUserByEmail.length > 0 || foundUserByCpf.length > 0;
  }
  findUserByEmail(email: string) {
    return this.userRepository.find({ email });
  }
  private findUserByCpf(cpf: string) {
    return this.userRepository.find({ cpf });
  }
  private async encryptPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}

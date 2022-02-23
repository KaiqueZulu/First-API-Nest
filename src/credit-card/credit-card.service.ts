import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import SolicitationStatus from './enum/solicitation-status.enum';
import { Solicitation } from './solicitation.entity';
import CreditCardRequestDTO from './types/credit-card-request.dto';

@Injectable()
export class CreditCardService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Solicitation)
    private SolicitationRepository: Repository<Solicitation>,
    private userService: UserService,
  ) {}
  async createSolicitation(@Body() creditCardRequest: CreditCardRequestDTO) {
    const userExists = await this.userService.verifyUserExists(
      creditCardRequest.email,
      creditCardRequest.cpf,
    );
    if (userExists) {
      throw new BadRequestException('User exists in the database');
    }
    const user = await this.userService.createUser({
      email: creditCardRequest.email,
      name: creditCardRequest.name,
      password: creditCardRequest.password,
      cpf: creditCardRequest.cpf,
    });
    const approved = this.isApproved();

    await this.SolicitationRepository.save(
      this.SolicitationRepository.create({
        preferredDueDay: creditCardRequest.preferredDueDay,
        user: user,
        status: approved
          ? SolicitationStatus.APPROVED
          : SolicitationStatus.DENIED,
      }),
    );

    return approved;
  }
  private isApproved() {
    const score = this.requestScore();
    return score >= 600;
  }
  private requestScore() {
    return this.randomIntFromInterval(0, 1000);
  }
  private randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

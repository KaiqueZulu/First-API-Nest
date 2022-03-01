import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { addYears } from 'date-fns';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import CreditCard from './credit-card.entity';
import SolicitationStatus from './enum/solicitation-status.enum';
import { Solicitation } from './solicitation.entity';
import CreditCardRequestDTO from './types/credit-card-request.dto';
import Brands from './enum/brands.enum';
import { User } from 'src/user/user.entity';
import generateCreditCard from './helpers/generate-credit-card.helper';
import UserStatus from 'src/user/enum/user-status.enum';

@Injectable()
export class CreditCardService {
  constructor(
    @InjectRepository(Solicitation)
    private SolicitationRepository: Repository<Solicitation>,
    @InjectRepository(CreditCard)
    private creditCardRepository: Repository<CreditCard>,
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
    const approved = this.isApproved();
    const user = await this.userService.createUser({
      email: creditCardRequest.email,
      name: creditCardRequest.name,
      password: creditCardRequest.password,
      cpf: creditCardRequest.cpf,
      status: approved ? UserStatus.ENABLED : UserStatus.DISABLED,
    });

    await this.SolicitationRepository.save(
      this.SolicitationRepository.create({
        preferredDueDay: creditCardRequest.preferredDueDay,
        user: user,
        status: approved
          ? SolicitationStatus.APPROVED
          : SolicitationStatus.DENIED,
      }),
    );
    if (approved) {
      this.generateCreditCardForApprovedSolicitation(user);
    }

    return approved;
  }
  private async generateCreditCardForApprovedSolicitation(user: User) {
    const DEFAULT_BRAND = Brands.VISA;
    return await this.creditCardRepository.save(
      this.creditCardRepository.create({
        valid_until: addYears(new Date(), 5),
        number: generateCreditCard(DEFAULT_BRAND),
        cvv: '000',
        brand: DEFAULT_BRAND,
        user,
      }),
    );
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

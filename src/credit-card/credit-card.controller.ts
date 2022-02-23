import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreditCardService } from './credit-card.service';
import CreditCardRequestDTO from './types/credit-card-request.dto';

@ApiTags('Request')
@Controller('credit-card')
export class CreditCardController {
  constructor(private creditCardService: CreditCardService) {}
  @Post('request')
  async request(@Body() creditCardRequest: CreditCardRequestDTO) {
    console.log('creditCardRequest', creditCardRequest);
    const approved = await this.creditCardService.createSolicitation(
      creditCardRequest,
    );
    return {
      approved,
    };
  }
}

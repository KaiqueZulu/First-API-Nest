import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

class CreditCardRequestDTO {
  @ApiProperty({
    description: 'Dia do pagamento da fatura',
  })
  @IsNumber()
  preferredDueDay: number;

  @ApiProperty({
    description: 'Nome do usuario',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email do usuario, usado para login',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha usada para login',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'CPF do usuario',
  })
  @IsNotEmpty()
  @IsNumberString()
  cpf: string;
}

export default CreditCardRequestDTO;

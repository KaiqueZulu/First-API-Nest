import { ApiProperty } from '@nestjs/swagger';

class LoginDataDTO {
  @ApiProperty({
    description: '',
  })
  email: string;
  @ApiProperty({
    description: '',
  })
  password: string;
}

export default LoginDataDTO;

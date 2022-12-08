import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ReqLoginUserDto {
  @IsEmail(
    {},
    {
      message: 'Informe um endereço de email válido',
    },
  )
  @MaxLength(200, {
    message: 'O endereço de email deve ter menos de 200 caracteres',
  })
  email?: string;

  @MaxLength(200, {
    message: 'O nome deve ter menos de 200 caracteres',
  })
  username?: string;

  @IsNotEmpty({
    message: 'Informe uma senha',
  })
  @MinLength(6, {
    message: 'A senha deve ter no mínimo 6 caracteres',
  })
  password: string;
}

export class ResLoginUserDto {
  token: string;
}

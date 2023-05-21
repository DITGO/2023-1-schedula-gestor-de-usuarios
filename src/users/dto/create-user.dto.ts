// Importa decorators adicionais para validação de campos.

// Possibilidade de usar o decorator @Matches para aumentar a segurança das senhas
import { IsEmail, IsNotEmpty, MaxLength, MinLength, Length } from 'class-validator';
import { IsCPF } from "class-validator-cpf";

export class CreateUserDto {
  /*Email*/

  @IsNotEmpty({
    message: 'Informe um endereço de email',
  })
  @IsEmail(
    {},
    {
      message: 'Informe um endereço de email válido',
    },
  )
  @MaxLength(200, {
    message: 'O endereço de email deve ter menos de 200 caracteres',
  })
  email: string;

  /*Name*/

  @IsNotEmpty({
    message: 'Informe o nome do usuário',
  })
  @MaxLength(200, {
    message: 'O nome deve ter menos de 200 caracteres',
  })
  name: string;

  /*Username*/

  @IsNotEmpty({
    message: 'Informe o nome do usuário',
  })
  @MaxLength(50, {
    message: 'O nome deve ter menos de 50 caracteres',
  })
  username: string;

  /*Position*/

  @IsNotEmpty({
    message: 'Informe um cargo',
  })
  @MaxLength(200, {
    message: 'O cargo deve ter menos de 200 caracteres',
  })
  position: string;

  /*Profile*/

  @IsNotEmpty({
    message: 'Informe um perfil de usuário',
  })
  profile: string;

  /*Password*/

  @IsNotEmpty({
    message: 'Informe uma senha',
  })
  @MinLength(6, {
    message: 'A senha deve ter no mínimo 6 caracteres',
  })
  password: string;

  /*CPF*/
  
  @IsNotEmpty({
    message: 'Informe um CPF',
  })
  @Length(14, 14, {
    message: 'Informe um CPF com 14 caracteres',
  })
  @IsCPF({
    message: 'Informe um CPF válido',
  })
  cpf: string;
}

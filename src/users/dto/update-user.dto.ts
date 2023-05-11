import { UserProfile } from '../user-profiles.enum';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { IsCPF } from 'class-validator-cpf';
export class UpdateUserDto {
  /*Name*/
  @IsOptional()
  @IsString({
    message: 'Informe um nome válido',
  })
  name: string;

  /*Username*/
  @IsOptional()
  @IsString({
    message: 'Informe um nome de usuário válido',
  })
  username: string;

  /*Email*/
  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'Informe um endereço de email válido',
    },
  )
  email: string;

  /*Position*/
  @IsOptional()
  @IsString({
    message: 'Informe um cargo válido',
  })
  position: string;

  /*Profile*/
  @IsOptional()
  profile: UserProfile;

  /*CPF*/
  @IsOptional()
  @IsString({
    message: 'Informe um CPF válido',
  })
  @IsCPF({
    message: 'Informe um CPF válido',
  })
  cpf: string;

}

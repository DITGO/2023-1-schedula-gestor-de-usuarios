import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UserProfile } from './user-profiles.enum';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /* Cria um usuário */
  /* Recebe os dados do usuário a ser criado */
  /* Retorna os dados do usuário criado */
  async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const user = this.userRepository.create({ ...createUserDto });
      user.profile = UserProfile[createUserDto.profile];
      user.confirmationToken = crypto.randomBytes(32).toString('hex');
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(
        createUserDto.password,
        user.salt,
      );
      await this.userRepository.save(user);
      delete user.password;
      delete user.salt;
      return {
        username: user.username,
        email: user.email,
        name: user.name,
        position: user.position,
        profile: user.profile,
      };
    } catch (error) {
      if (error.code.toString() === '23505') {
        throw new ConflictException('Endereço de email já está em uso');
      } else {
        throw new InternalServerErrorException(
          'Erro ao salvar o usuário no banco de dados',
        );
      }
    }
  }
  /*Encripta a senha*/
  /* Recebe a senha e um salto*/
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  /* Encontra e retorna todos os usuários cadastrados */
  async findUsers(): Promise<UserDto[]> {
    const users = await this.userRepository.find();
    if (users.length === 0)
      throw new NotFoundException('Não existem usuarios cadastrados');
    return users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      position: user.position,
      profile: user.profile,
    }));
  }

  /* Encontra e retorna um usuário */
  /* Recebe o id do usuário como parâmetro */
  async findUserById(userId: string): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return {
      username: user.username,
      email: user.email,
      name: user.name,
      position: user.position,
      profile: user.profile,
    };
  }

  /* Atualiza um usuário */
  /* Recebe o id do usuário a ser atualizado e os dados do usuário atualizados como parâmetros */
  async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const { name, username, email, position, profile } = updateUserDto;
    user.name = name ? name : user.name;
    user.username = username ? username : user.username;
    user.email = email ? email : user.email;
    user.position = position ? position : user.position;
    user.profile = profile ? profile : user.profile;

    try {
      await this.userRepository.save(user);
      return {
        username: user.username,
        email: user.email,
        name: user.name,
        position: user.position,
        profile: user.profile,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao salvar os dados no banco de dados',
      );
    }
  }

  /* Deleta um usuário */
  /* Recebe o id do usuário a ser deletado como parâmetro */
  async deleteUser(userId: string) {
    const user = await this.userRepository.delete({ id: userId });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (user.affected === 0) {
      throw new NotFoundException(
        'Não foi encontrado um usuário com o ID informado',
      );
    }
  }
}

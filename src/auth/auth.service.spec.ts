import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserProfile } from '../users/user-profiles.enum';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { InternalServerErrorException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: Repository<User>;

  const mockUserDto: CreateUserDto = {
    email: 'mock@mail.com',
    name: 'Mock Mockerson',
    username: 'mock',
    position: 'police',
    profile: UserProfile.ADMIN,
    password: 'mock123!',
    cpf: '056.065.766-86',
  };

  beforeEach(async () => {
    const mockSalt = await bcrypt.genSalt();
    const mockEncryptedPassword = await bcrypt.hash(
      mockUserDto.password,
      mockSalt,
    );
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secretOrPrivateKey: 'super-secret',
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
      providers: [
        AuthService,
        JwtStrategy,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn((_: string) => {
              return {
                ...mockUserDto,
                id: uuidv4(),
                salt: mockSalt,
                password: mockEncryptedPassword,
              };
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('Auth', () => {
    const mockUserDataWithEmail = {
      email: mockUserDto.email,
      password: mockUserDto.password,
    };

    const mockUserDataWithUsername = {
      username: mockUserDto.username,
      password: mockUserDto.password,
    };

    it('should return a peyload when email and correct password are inserted', async () => {
      const response = await authService.Auth(mockUserDataWithEmail);

      expect(response).toBeDefined();
    });

    it('should return a peyload when username and correct password are inserted', async () => {
      const response = await authService.Auth(mockUserDataWithUsername);

      expect(response).toBeDefined();
    });

    it('should return an error when username or email is not signed', () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(undefined);

      expect(authService.Auth(mockUserDataWithEmail)).rejects.toThrowError();
    });

    it('should return an internal server error when password is incorrect', async () => {
      const mockWithIncorrectPassword = {
        ...mockUserDataWithEmail,
        password: 'mock12!',
      };

      expect(authService.Auth(mockWithIncorrectPassword)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });
});

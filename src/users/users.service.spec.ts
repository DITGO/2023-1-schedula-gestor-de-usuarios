import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

import { v4 as uuid } from 'uuid';
import { UserProfile } from './user-profiles.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  const mockUuid = uuid();

  const mockUserDto: CreateUserDto = {
    email: 'mock@mail.com',
    name: 'Mock Mockerson',
    username: 'mock',
    position: 'police',
    profile: UserProfile.ADMIN,
    password: 'mock123!',
    cpf: '056.065.766-86',
  };

  const mockReturnUserDto: UserDto = {
    email: 'mock@mail.com',
    name: 'Mock Mockerson',
    username: 'mock',
    position: 'police',
    profile: UserProfile.ADMIN,
    cpf: '056.065.766-86',
  };

  const mockUpdateUserDto: UpdateUserDto = {
    email: 'mock@gmail.com',
    name: 'Mocking Mockerson',
    username: 'mocking',
    position: 'police',
    profile: UserProfile.ADMIN,
    cpf: '056.065.766-86',
  };

  const usersEntityList = [{ ...mockReturnUserDto }];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockResolvedValue(new User()),
            find: jest.fn().mockResolvedValue(usersEntityList),
            findOneBy: jest.fn().mockResolvedValue(usersEntityList[0]),
            delete: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('createUser', () => {
    const dto = mockUserDto;
    it('should call user repository with correct params', async () => {
      await usersService.createUser(dto);
      expect(usersRepository.create).toHaveBeenCalledWith({
        ...dto,
      });
      expect(usersRepository.create);
    });
  });

  describe('findUsers', () => {
    it('should return an user entity list successfully', async () => {
      const response = await usersService.findUsers();

      expect(response).toEqual(usersEntityList);
      expect(usersRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw a not found exception', () => {
      jest.spyOn(usersRepository, 'find').mockResolvedValueOnce([]);

      expect(usersService.findUsers()).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findUserById', () => {
    const id = mockUuid;

    it('should return an user entity successfully', async () => {
      const response = await usersService.findUserById(id);

      expect(response).toEqual(usersEntityList[0]);
    });

    it('should throw a not found exception', () => {
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValueOnce(null);

      expect(usersService.findUserById(id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    const id = mockUuid;
    const dto = mockUpdateUserDto;

    it('should return an updated user successfully', async () => {
      const response = await usersService.updateUser({ ...dto }, id);
      expect(response).toMatchObject({ ...mockUpdateUserDto });
    });

    it('should return an internal server error exception when user cannot be updated', async () => {
      jest.spyOn(usersRepository, 'save').mockRejectedValue(new Error());

      expect(usersService.updateUser({ ...dto }, id)).rejects.toThrowError(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteUser', () => {
    it('should return a not found exception', () => {
      const id = mockUuid;

      jest.spyOn(usersRepository, 'delete').mockResolvedValue(null);
      expect(usersService.deleteUser(id)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should return a not found exception', () => {
      const id = mockUuid;

      jest
        .spyOn(usersRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as DeleteResult);

      expect(usersService.deleteUser(id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});

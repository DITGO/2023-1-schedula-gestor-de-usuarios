import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfile } from './user-profiles.enum';

describe('UsersController', () => {
  let usersController: UsersController;

  const mockUuid = uuidv4();

  const mockCreateUserDto: CreateUserDto = {
    email: 'mock@mail.com',
    name: 'Mock Mockerson',
    username: 'mock',
    position: 'police',
    profile: UserProfile.ADMIN,
    password: 'mock123!',
    cpf: '056.065.766-86',
  };

  const mockUpdateUserDto: UpdateUserDto = {
    name: 'Mock Silva',
    username: 'mockinho',
    email: 'mock@gmail.com',
    position: 'tech',
    profile: UserProfile.ADMIN,
    cpf: '056.065.766-86',
  };

  const mockUsersService = {
    createUser: jest.fn((dto) => {
      return {
        ...dto,
        message: 'Usuario cadastrado com sucesso',
      };
    }),
    findUserById: jest.fn((id) => {
      return {
        ...mockCreateUserDto,
        id,
        message: 'Usuário encontrado',
      };
    }),
    updateUser: jest.fn((dto, id) => {
      return {
        ...CreateUserDto,
        ...dto,
        id,
      };
    }),
    deleteUser: jest.fn((id) => {
      return {
        message: 'Usuário removido com sucesso',
      };
    }),
    findUsers: jest.fn(() => {
      return [{ ...mockCreateUserDto }];
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    usersController = app.get<UsersController>(UsersController);
  });

  describe('users', () => {
    it('should be defined"', () => {
      expect(usersController).toBeDefined();
    });

    it('should create an user with success', async () => {
      const dto = mockCreateUserDto;
      const response = await usersController.createUser(dto);
      const successMessage = 'Usuario cadastrado com sucesso';

      expect(response.user).toMatchObject({ ...dto });
      expect(response.message).toEqual(successMessage);
    });

    it('should return an user with success', async () => {
      const userId = mockUuid;
      const successMessage = 'Usuário encontrado';
      const response = await usersController.findUserById(userId);

      expect(response.user).toMatchObject({ id: userId });
      expect(response.message).toEqual(successMessage);
    });

    it('should update an user with success', async () => {
      const userId = mockUuid;
      const dto = mockUpdateUserDto;
      const response = await usersController.updateUser(dto, userId);

      expect(response).toMatchObject({ ...dto, id: userId });
    });

    it('should delete an user with success', async () => {
      const userId = mockUuid;
      const successMessage = 'Usuário removido com sucesso';
      const response = await usersController.deleteUser(userId);

      expect(response).toMatchObject({ message: successMessage });
    });

    it('should return all users with success', async () => {
      const response = await usersController.getUsers();

      expect(response.length).toBeGreaterThan(0);
      expect(response).toEqual([{ ...mockCreateUserDto }]);
    });
  });
});

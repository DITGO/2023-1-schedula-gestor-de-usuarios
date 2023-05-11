import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['email', 'cpf'])
export class User extends BaseEntity {
  /*Identificador da classe gerado automaticamente */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /*Email */
  @Column({ nullable: false, type: 'varchar', length: 200 })
  email: string;

  /*Nome */
  @Column({ nullable: false, type: 'varchar' })
  name: string;

  /*Nome de usuário */
  @Column({ nullable: false, type: 'varchar' })
  username: string;

  /*Posição */
  @Column({ nullable: false, type: 'varchar', length: 200 })
  position: string;

  /*Perfi */
  @Column({ nullable: false, type: 'varchar', length: 20 })
  profile: string;

  /*Senha */
  @Column({ nullable: false })
  password: string;

  /*CPF */
  @Column({ nullable: false, type: 'varchar', length: 14 })
  cpf: string;

  /*Salto */
  @Column({ nullable: false })
  salt: string;

  /*Token de confirmação */
  @Column({ nullable: true, type: 'varchar', length: 64 })
  confirmationToken: string;

  /*Token de recuperação */
  @Column({ nullable: true, type: 'varchar', length: 64 })
  recoverToken: string;

  /*Data de criação do registro */
  @CreateDateColumn()
  createdAt: Date;

  /*Data de atualização do registro*/
  @UpdateDateColumn()
  updatedAt: Date;
}

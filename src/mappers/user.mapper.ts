import { Repository, DataSource } from 'typeorm';
import { User } from '../models/entity/User';

export type ExtendedUserRepository = Repository<User> & {
  findOneById(id: number): Promise<User | null>;
  findOneByAccount(userAccount: string): Promise<User | null>;
};

export const UserMapper = (
    dataSource: DataSource,
): ExtendedUserRepository => {
  return dataSource.getRepository(User).extend({
    async findOneById(
        this: Repository<User>,
        id: number,
    ): Promise<User | null> {
      return await this.findOne({ where: { id } });
    },
    async findOneByAccount(
        this: Repository<User>,
        userAccount: string,
    ): Promise<User | null> {
      return await this.findOne({ where: { userAccount } });
    },
  }) as ExtendedUserRepository;
};
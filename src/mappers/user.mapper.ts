import { Repository, DataSource } from 'typeorm';
import { User } from '../models/entity/User';

export const UserMapper = (
  dataSource: DataSource,
): Repository<User> & { findOneById(id: number): Promise<User | null> } => {
  return dataSource.getRepository(User).extend({
    async findOneById(
      this: Repository<User>,
      id: number,
    ): Promise<User | null> {
      return await this.findOne({ where: { id } });
    },
  });
};

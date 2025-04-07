import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async firstWhere(column: string, value: string | number, operator = '=') {
    return await this.createQueryBuilder()
      .where(`${column} ${operator} :value`, { value })
      .getOne();
  }
}

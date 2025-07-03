import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/enums/role.enum';
import { OrNotFound } from 'src/types/aliases';
import { log } from 'console';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  private async getUser(id: string): OrNotFound<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException('User is not Found!');
    return user;
  }

  async findAll(): OrNotFound<User[]> {
    const users = await this.userRepo.find({ where: { role: Role.USER } });
    if (!users.length) throw new NotFoundException('No Users Found!');
    return users;
  }

  async findOne(id: string): OrNotFound<User> {
    return await this.getUser(id);
  }

  async update(id: string, input: UpdateUserInput): OrNotFound<Boolean> {
    await this.getUser(id);
    if (Object.values(input).length <= 1)
      throw new Error('Not allowed to send empty data!');
    await this.userRepo.update(id, input);
    return true;
  }

  async remove(id: string): OrNotFound<Boolean> {
    await this.getUser(id);
    await this.userRepo.delete(id);
    return true;
  }
}

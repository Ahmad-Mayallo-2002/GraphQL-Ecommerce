import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/enums/role.enum';
import { OrNotFound } from 'src/types/aliases';
import { log } from 'console';
import { UsersAndCounts } from 'src/types/UsersAndCounts';

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

  async seedAdmin(userId: string) {
    const users = await this.userRepo.findBy({ role: Role.ADMIN });
    if (users.length > 1) throw new Error('No More Than One Admin.');
    const user = (await this.getUser(userId)) as User;
    if (user?.role === Role.ADMIN) return 'You Already Are Admin.';
    await this.userRepo.update({ id: userId }, { role: Role.ADMIN });
    return 'Congratulations You Are Admin Now.';
  }

  async findAll(take: number, skip: number): OrNotFound<UsersAndCounts> {
    const users = await this.userRepo.find({
      where: { role: Role.USER },
      take,
      skip,
    });
    const count = await this.userRepo.count({
      where: { role: Role.USER },
    });
    if (!users.length) throw new NotFoundException('No Users Found!');
    return { users, count };
  }

  async findOne(id: string): OrNotFound<User> {
    return await this.getUser(id);
  }

  async update(id: string, input: UpdateUserInput): OrNotFound<String> {
    await this.getUser(id);
    if (Object.values(input).length <= 1)
      throw new Error('Not allowed to send empty data!');
    const user = await this.userRepo.findOneBy({ email: input.email });
    if (input.email) {
      if (user) throw new Error('This Email is Already Exist.');
    }
    await this.userRepo.update(id, input);
    return 'User is Updated.';
  }

  async remove(id: string): OrNotFound<Boolean> {
    await this.getUser(id);
    await this.userRepo.delete(id);
    return true;
  }
}

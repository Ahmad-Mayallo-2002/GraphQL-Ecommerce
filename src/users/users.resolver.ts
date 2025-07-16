import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { OrNotFound } from 'src/types/aliases';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { log } from 'console';
import { Payload } from 'src/types/payload.type';
import { UsersAndCounts } from 'src/types/UsersAndCounts';

@Resolver(() => UsersAndCounts)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => UsersAndCounts, { name: 'getUsers' })
  findAll(
    @Args('take', { type: () => Int })
    take: number,
    @Args('skip', { type: () => Int, defaultValue: 0 })
    skip: number,
  ): OrNotFound<UsersAndCounts> {
    return this.usersService.findAll(take, skip);
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { name: 'getUser' })
  findOne(@CurrentUser() user: Payload): OrNotFound<User> {
    return this.usersService.findOne(user.sub.userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String, { name: 'seedAdmin' })
  seedAdmin(@CurrentUser() user: Payload): OrNotFound<String> {
    return this.usersService.seedAdmin(user.sub.userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => String)
  updateUser(
    @Args('input') input: UpdateUserInput,
    @CurrentUser() user: Payload,
  ): OrNotFound<String> {
    return this.usersService.update(user.sub.userId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean, { name: 'deleteUser' })
  removeUser(
    @Args('id', { type: () => String }) id: string,
  ): OrNotFound<Boolean> {
    return this.usersService.remove(id);
  }
}

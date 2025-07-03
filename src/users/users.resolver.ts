import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
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

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Query(() => [User], { name: 'getUsers' })
  findAll(): OrNotFound<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { name: 'getUser' })
  findOne(@CurrentUser() user: Payload): OrNotFound<User> {
    return this.usersService.findOne(user.sub.userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  updateUser(
    @Args('input') input: UpdateUserInput,
    @CurrentUser() user: Payload,
  ): OrNotFound<Boolean> {
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

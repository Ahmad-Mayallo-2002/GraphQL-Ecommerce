import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { AuthType } from 'src/types/auth.type';
import { LoginInput } from './input/login.type';
import { CurrentUser } from './decorators/current-user.decorator';
import { Payload } from 'src/types/payload.type';
import { AuthGuard } from './guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User, { name: 'signUp' })
  async signUp(@Args('input') input: CreateUserInput) {
    return await this.authService.signUp(input);
  }

  @Mutation(() => AuthType, { name: 'login' })
  async login(@Args('input') input: LoginInput) {
    return await this.authService.login(input);
  }

  @Mutation(() => String, { name: 'sendCodePassword' })
  async sendCodePassword(@Args('email') email: string) {
    return await this.authService.sendCodePassword(email);
  }

  @Mutation(() => Boolean, { name: 'enterCompareCode' })
  async enterCompareCode(
    @Args('sendedCode') sendedCode: string,
    @Args('writtenCode') writtenCode: string,
  ) {
    return this.authService.enterCompareCode(sendedCode, writtenCode);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean, { name: 'updatePassword' })
  async updatePassword(
    @Args('newPassword') newPassword: string,
    @Args('confirmNewPassword') confirmNewPassword: string,
    @CurrentUser() currentUser: Payload,
  ) {
    return await this.authService.updatePassword(
      newPassword,
      confirmNewPassword,
      currentUser.sub.userId,
    );
  }
}

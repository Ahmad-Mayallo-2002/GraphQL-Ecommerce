import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginInput } from './input/login.type';
import { JwtService } from '@nestjs/jwt';
import { Payload } from 'src/types/payload.type';
import { sendMail } from './sendMail';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(input: CreateUserInput) {
    const user = await this.userRepo.findOneBy({ email: input.email });
    if (user) return new ConflictException('This email is used!');

    const newUser = this.userRepo.create({
      ...input,
      password: await hash(input.password, 10),
    });
    await this.userRepo.save(newUser);
    return newUser;
  }

  async validateUser(input: LoginInput) {
    const user = await this.userRepo.findOneBy({ email: input.email });
    if (!user) throw new UnauthorizedException('Invalid Email!');
    const comparePassword = await compare(input.password, user.password);
    if (!comparePassword) throw new UnauthorizedException('Invalid Password!');
    return user;
  }

  async generateAccessToken(payload: Payload) {
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  async login(input: LoginInput) {
    const user = (await this.validateUser(input)) as User;
    const payload: Payload = {
      sub: {
        userId: user?.id,
        role: user.role,
      },
    };
    const accessToken = await this.generateAccessToken(payload);
    return {
      token: accessToken,
      role: user.role,
      id: user.id,
    };
  }

  async sendCodePassword(email: string) {
    const code = await sendMail(email);
    return code;
  }

  async enterCompareCode(sendedCode: string, writtenCode: string) {
    return sendedCode === writtenCode;
  }

  async updatePassword(
    newPassword: string,
    confirmNewPassword: string,
    id: string,
    oldPassword: string,
  ) {
    const user = (await this.userRepo.findOneBy({ id })) as User;
    const comparePass = await compare(oldPassword, user.password);
    if (!comparePass) throw new Error('Invalid Password');
    if (!newPassword || !confirmNewPassword)
      throw new Error('Two passwords are required');
    if (newPassword !== confirmNewPassword)
      throw new Error('Passwords are not equal');
    await this.userRepo.update(
      { id },
      {
        password: await hash(newPassword, 10),
      },
    );
    return true;
  }

  async updateForgottedPassword(
    email: string,
    newPassword: string,
    confirmNewPassword: string,
  ) {
    if (!newPassword || !confirmNewPassword)
      throw new Error('Two passwords are required');
    if (newPassword !== confirmNewPassword)
      throw new Error('Passwords are not equal');
    await this.userRepo.update(
      { email },
      { password: await hash(newPassword, 10) },
    );
    return true;
  }
}

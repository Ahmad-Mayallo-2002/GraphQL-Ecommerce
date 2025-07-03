import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/enums/role.enum';

@InputType()
export class CreateUserInput {
  @IsNotEmpty()
  @IsString()
  @Field({ nullable: false })
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Field({ nullable: false })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field({ nullable: false })
  password: string;

  @Field(() => Role, { nullable: false, defaultValue: Role.USER })
  role: Role;
}

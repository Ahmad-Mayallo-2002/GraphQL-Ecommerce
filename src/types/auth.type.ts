import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from 'src/enums/role.enum';

@ObjectType()
export class AuthType {
  @Field()
  token: string;

  @Field()
  id: string;

  @Field(() => Role)
  role: Role;
}

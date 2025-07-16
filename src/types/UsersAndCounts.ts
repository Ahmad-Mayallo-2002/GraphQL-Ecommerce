import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class UsersAndCounts {
  @Field(() => [User])
  users: User[];

  @Field(() => Int)
  count: number;
}

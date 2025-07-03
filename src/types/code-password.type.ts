import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CodePassword {
  @Field()
  code: string;
}

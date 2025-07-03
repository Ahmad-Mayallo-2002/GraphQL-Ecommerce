import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class EmailInput {
    @Field()
    email: string;
}
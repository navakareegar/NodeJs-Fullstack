import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => Int)
  id: number;

  @Field()
  username: string;

  @Field(() => [String])
  permissions: string[];
}

@ObjectType()
export class LoginResponseType {
  @Field()
  message: string;

  @Field(() => UserType)
  user: UserType;

  @Field(() => [String])
  allPermissions: string[];

  @Field()
  expiresAt: Date;
}

@ObjectType()
export class LogoutResponseType {
  @Field()
  message: string;
}

@ObjectType()
export class PermissionResultType {
  @Field()
  result: string;
}

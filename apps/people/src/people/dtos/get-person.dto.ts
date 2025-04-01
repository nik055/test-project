import { Expose, Transform, Type } from "class-transformer";
import { $Enums } from "@prisma/client";
import { PrismaModel } from "@people/models";
import _Person = PrismaModel.Person;

export class GetPersonDto implements _Person {
  @Expose()
  id: string;
  @Expose()
  login: string;
  @Expose()
  email: string;
  @Expose()
  password: string;
  @Expose()
  age: number;
  @Expose()
  details: string;
  @Expose()
  isDeleted: boolean;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
  @Expose()
  deletedAt?: Date;
  @Expose()
  roles: $Enums.Roles[];
  @Expose()
  activeAvatars: number;
  @Expose()
  @Transform(({ value }) => (value !== undefined ? new Number(value) : new Number(0)))
  @Type(() => Number)
  balance: number;
}

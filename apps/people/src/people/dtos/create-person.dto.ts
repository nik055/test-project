import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { PrismaModel } from "@people/models";
import _Person = PrismaModel.Person;

export class CreatePersonDto
  implements
    Omit<
      _Person,
      | "id"
      | "isDeleted"
      | "createdAt"
      | "updatedAt"
      | "deletedAt"
      | "roles"
      | "activeAvatars"
      | "balance"
    >
{
  @ApiProperty({
    description: "User login",
    nullable: false,
    required: true,
    minLength: 5,
    maxLength: 256,
    type: "string",
  })
  @IsString()
  @MinLength(5, {
    message: "The login value is too short. Minimal length is 5",
  })
  @MaxLength(256, {
    message: "The login value is too long. Maximal length is 256",
  })
  @IsNotEmpty()
  @Expose()
  login: string;

  @ApiProperty({
    description: "User email",
    nullable: false,
    required: true,
    maxLength: 256,
    type: "string",
  })
  @IsString()
  @IsEmail({}, { message: "The email value is not a valid email" })
  @MaxLength(256, {
    message: "The email value is too long. Maximal length is 256",
  })
  @IsNotEmpty()
  @Expose()
  email: string;

  @ApiProperty({
    description: "User password",
    nullable: false,
    required: true,
    minLength: 8,
    maxLength: 256,
    type: "string",
  })
  @IsString()
  @MinLength(8, {
    message: "The password value is too short. Minimal length is 8",
  })
  @MaxLength(256, {
    message: "The password value is too long. Maximal length is 256",
  })
  @IsNotEmpty()
  @Expose()
  password: string;

  @ApiProperty({
    description: "User age",
    nullable: false,
    required: true,
    minimum: 13,
    maximum: 130,
    type: "number",
  })
  @IsNumber()
  @Min(13, { message: "The age value is too low. Minimal age is 13" })
  @Max(130, { message: "The age value is too high. Maximal length is 130" })
  @IsNotEmpty()
  @Expose()
  age: number;

  @ApiProperty({
    description: "User details",
    nullable: false,
    required: true,
    minLength: 5,
    maxLength: 1000,
    type: "string",
  })
  @IsString()
  @MinLength(5, {
    message: "The details value is too short. Minimal length is 5",
  })
  @MaxLength(1000, {
    message: "The details value is too long. Maximal length is 1000",
  })
  @IsNotEmpty()
  @Expose()
  details: string;
}

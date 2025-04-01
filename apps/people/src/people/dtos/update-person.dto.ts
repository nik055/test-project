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
import { CreatePersonDto } from "./create-person.dto";
import { Roles } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class UpdatePersonDto implements Partial<CreatePersonDto> {
  @ApiProperty({
    description: "User login",
    nullable: false,
    required: true,
    minLength: 5,
    maxLength: 1000,
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
  login: string;

  @ApiProperty({
    description: "User email",
    nullable: false,
    required: true,
    maxLength: 256,
    type: "string",
  })
  @IsString()
  @IsEmail()
  @MaxLength(256, {
    message: "The email value is too long. Maximal length is 256",
  })
  @IsNotEmpty()
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
  password: string;

  @ApiProperty({
    description: "User age",
    nullable: false,
    required: true,
    minimum: 13,
    maximum: 130,
    type: "string",
  })
  @IsNumber()
  @Min(13, { message: "The age value is too low. Minimal age is 13" })
  @Max(130, { message: "The age value is too high. Maximal length is 130" })
  @IsNotEmpty()
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
  details: string;

  @ApiProperty({
    description: "User roles",
    nullable: false,
    required: true,
    enum: Roles,
    isArray: true,
    type: "string",
    default: [Roles.USER],
  })
  @IsNotEmpty({ message: "The roles value is required" })
  roles: Roles[];

  @ApiProperty({
    description: "User balance",
    nullable: false,
    required: false,
    minimum: 0,
    type: "number",
  })
  @IsNumber()
  @IsNotEmpty({ message: "The balance value is required" })
  @Min(0, { message: "The balance value is too low. Minimal valance is 0" })
  balance?: number;
}

import { Roles } from "@prisma/client";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Person {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  login: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  password: string;

  @ApiProperty({ type: Number })
  age: number;

  @ApiProperty({ type: String })
  details: string;

  @ApiProperty({ type: Boolean })
  isDeleted: boolean;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiPropertyOptional({ type: Date })
  deletedAt?: Date;

  @ApiProperty({ isArray: true, enum: Roles, enumName: "Roles" })
  roles: Roles[];

  @ApiProperty({ type: Number })
  activeAvatars: number;

  @ApiProperty({ type: Number })
  balance: number;
}

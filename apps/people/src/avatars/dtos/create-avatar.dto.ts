import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAvatarDto {
  @ApiProperty({
    description: "Person ID",
    nullable: false,
    required: true,
    minLength: 1,
    maxLength: 256,
    type: "string",
  })
  @IsString()
  @MinLength(1, {
    message: "The personId value is too short. Minimal length is 5",
  })
  @MaxLength(256, {
    message: "The personId value is too long. Maximal length is 256",
  })
  @IsNotEmpty()
  readonly personId: string;
}

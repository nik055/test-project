import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TransferMoneyDto {
  @ApiProperty({
    description: "User id sending money",
    nullable: false,
    required: true,
    type: "string",
  })
  // @IsString()
  userIdSendingMoney?: string;

  @ApiProperty({
    description: "User id receiving money",
    nullable: false,
    required: true,
    type: "string",
  })
  @IsString()
  @IsNotEmpty()
  userIdReceivingMoney: string;

  @ApiProperty({
    description: "Amount of money to transfer",
    nullable: false,
    required: true,
    minimum: 1,
    type: "number",
  })
  @IsNumber()
  @IsNotEmpty()
  amountToTransfer: number;
}

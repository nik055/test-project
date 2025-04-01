import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export namespace TransferMoneyContract {
  export const pattern = "transfer-money";

  export class Request {
    @IsString()
    @IsNotEmpty()
    userIdSendingMoney: string;

    @IsString()
    @IsNotEmpty()
    userIdReceivingMoney: string;

    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    amountToTransfer: number;
  }

  export class Response {
    amountToTransfer: boolean;
  }
}

import { Expose } from "class-transformer";

export class TransferSucceededDto {
  @Expose()
  isSucceeded: boolean;
}

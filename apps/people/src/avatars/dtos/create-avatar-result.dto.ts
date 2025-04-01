import { Avatar } from "../../../prisma/generated/avatar";
import { Expose } from "class-transformer";

export class CreateAvatarResultDto implements Omit<Avatar, "deletedAt"> {
  @Expose()
  path: string;
  @Expose()
  name: string;
  @Expose()
  personId: string;
  @Expose()
  isDeleted: boolean;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}

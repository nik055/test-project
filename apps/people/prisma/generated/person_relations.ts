import { Avatar } from "./avatar";
import { ApiProperty } from "@nestjs/swagger";

export class PersonRelations {
  @ApiProperty({ isArray: true, type: () => Avatar })
  avatar: Avatar[];
}

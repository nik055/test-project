import { Person } from "./person";
import { ApiProperty } from "@nestjs/swagger";

export class AvatarRelations {
  @ApiProperty({ type: () => Person })
  person: Person;
}

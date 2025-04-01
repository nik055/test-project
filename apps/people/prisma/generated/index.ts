import { PersonRelations as _PersonRelations } from "./person_relations";
import { AvatarRelations as _AvatarRelations } from "./avatar_relations";
import { Person as _Person } from "./person";
import { Avatar as _Avatar } from "./avatar";

export namespace PrismaModel {
  export class PersonRelations extends _PersonRelations {}
  export class AvatarRelations extends _AvatarRelations {}
  export class Person extends _Person {}
  export class Avatar extends _Avatar {}

  export const extraModels = [PersonRelations, AvatarRelations, Person, Avatar];
}

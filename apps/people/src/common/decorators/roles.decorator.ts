import { SetMetadata } from "@nestjs/common";
import { $Enums } from "@prisma/client";

export const ACCESS_ROLES_KEY = "accessRoles";
export const Roles = (...args: $Enums.Roles[]) => SetMetadata(ACCESS_ROLES_KEY, args);

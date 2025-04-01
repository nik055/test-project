import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { $Enums } from "@prisma/client";
import { ACCESS_ROLES_KEY } from "../decorators/roles.decorator";
import { JwtService } from "@nestjs/jwt";
import { ICheckTokenData, TokensService } from "../tokens/tokens.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly tokenService: TokensService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const check = this.checkIfAnyRolesAreRequired(context);
    if (!check) return true;
    else {
      const data: ICheckTokenData = this.tokenService.extractTokenFromRequest(context);
      const personRoles = this.jwtService.decode(data.token).roles;
      return check.some(role => personRoles.includes(role));
    }
  }

  private checkIfAnyRolesAreRequired(context: ExecutionContext): $Enums.Roles[] {
    const requiredRoles = this.reflector.getAllAndOverride<$Enums.Roles[]>(
      ACCESS_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (requiredRoles) return requiredRoles;
  }
}

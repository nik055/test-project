import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { ICheckTokenData, TokensService } from "../tokens/tokens.service";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly tokenService: TokensService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.checkIfMethodIsPublic(context)) return true;
    else {
      const data: ICheckTokenData = this.tokenService.extractTokenFromRequest(context);
      const secret: string = this.tokenService.extractSecretFromConfig();
      return await this.checkIfTokenIsValid({ ...data, secret });
    }
  }

  private checkIfMethodIsPublic(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
  }

  private async checkIfTokenIsValid(data: ICheckTokenData): Promise<boolean> {
    try {
      data.request["user"] = await this.jwtService.verifyAsync(data.token, {
        secret: data.secret,
      });
    } catch (err) {
      throw new UnauthorizedException();
    }
    return true;
  }
}

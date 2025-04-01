import { Request } from "express";
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtTokenConfigService } from "@app/jwt-module-configured/jwt-token-config/jwt-token.config.service";

export interface ICheckTokenData {
  request: Request;
  token: string;
  secret?: string;
}

@Injectable()
export class TokensService {
  constructor(private readonly jwtConfigService: JwtTokenConfigService) {}

  extractTokenFromRequest(context: ExecutionContext): ICheckTokenData {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    return { request, token };
  }

  extractSecretFromConfig(): string {
    return this.jwtConfigService.getSecret;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}

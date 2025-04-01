import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtTokenConfigService {
  constructor(private readonly configService: ConfigService) {}

  get getSecret(): string {
    return this.configService.get<string>("JWT_SECRET", { infer: true });
  }

  get getExpiresIn(): string {
    return this.configService.get<string>("JWT_EXPIRES_IN", { infer: true });
  }
}

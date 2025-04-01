import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NatsConfigService {
  constructor(private readonly configService: ConfigService) {}

  get getNatsServers(): string {
    return this.configService.get<string>("NATS_SERVERS", { infer: true });
  }

  get getNatsUsername(): string {
    return this.configService.get<string>("NATS_USERNAME", { infer: true });
  }

  get getNatsPassword(): string {
    return this.configService.get<string>("NATS_PASSWORD", { infer: true });
  }

  get getNatsPort(): number {
    return this.configService.get<number>("NATS_PORT", { infer: true });
  }
}

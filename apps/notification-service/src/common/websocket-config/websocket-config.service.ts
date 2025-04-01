import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class WebsocketConfigService {
  constructor(private readonly configService: ConfigService) {}

  get webSocketPort(): number {
    return this.configService.get<number>("WEBSOCKET_PORT");
  }

  get webSocketNamespace(): string {
    return this.configService.get<string>("WEBSOCKET_NAMESPACE");
  }
}

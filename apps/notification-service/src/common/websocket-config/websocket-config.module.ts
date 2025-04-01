import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { WebsocketConfigService } from "./websocket-config.service";

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [WebsocketConfigService],
  exports: [WebsocketConfigService],
})
export class WebsocketConfigModule {}

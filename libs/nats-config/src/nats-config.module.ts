import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { NatsConfigService } from "./nats-config.service";

@Module({
  imports: [ConfigModule],
  providers: [NatsConfigService],
  exports: [NatsConfigService],
})
export class NatsConfigModule {}

import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { getBullMQConfig } from "./bullmq.config";
import { BullMQConfigService } from "./bullmq.config.service";

@Module({
  imports: [BullModule.forRootAsync(getBullMQConfig())],
  providers: [BullMQConfigService],
  exports: [BullModule, BullMQConfigService],
})
export class ConfiguredBullMQModule {}

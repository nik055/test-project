import { SharedBullAsyncConfiguration } from "@nestjs/bullmq/dist/interfaces";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullMQConfigService } from "./bullmq.config.service";

export const getBullMQConfig = (): SharedBullAsyncConfiguration => {
  return {
    useFactory: async (bullMQConfigService: BullMQConfigService) => ({
      connection: {
        host: bullMQConfigService.getHost,
        port: bullMQConfigService.getPort,
      },
    }),
    inject: [ConfigService],
    imports: [ConfigModule],
  };
};

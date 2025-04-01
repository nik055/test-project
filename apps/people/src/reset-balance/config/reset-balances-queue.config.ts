import { RegisterQueueAsyncOptions } from "@nestjs/bullmq/dist/interfaces/register-queue-options.interface";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullMQConfigService } from "../../common/config/bullmq/bullmq.config.service";
import { RESET_BALANCE_QUEUE } from "./constants";

export const getResetBalanceQueueConfig = (): RegisterQueueAsyncOptions => {
  return {
    name: RESET_BALANCE_QUEUE,
    useFactory: (bullMQConfigService: BullMQConfigService) => ({
      connection: {
        host: bullMQConfigService.getHost,
        port: bullMQConfigService.getPort,
      },
    }),
    inject: [ConfigService],
    imports: [ConfigModule],
  };
};

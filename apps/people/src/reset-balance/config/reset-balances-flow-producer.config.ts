import { RESET_BALANCE_QUEUE_FLOW_PRODUCER } from "./constants";
import { BullMQConfigService } from "../../common/config/bullmq/bullmq.config.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RegisterQueueAsyncOptions } from "@nestjs/bullmq/dist/interfaces/register-queue-options.interface";

export const getResetBalanceFlowProducerConfig = (): RegisterQueueAsyncOptions => {
  return {
    name: RESET_BALANCE_QUEUE_FLOW_PRODUCER,
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

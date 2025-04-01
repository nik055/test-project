import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullMQConfigService } from "./bullmq.config.service";
import { UPLOAD_AVATAR_INTO_S3_FLOW_PRODUCER } from "../constants";
import { RegisterQueueAsyncOptions } from "@nestjs/bullmq/dist/interfaces/register-queue-options.interface";

export const getUploadAvatarIntoS3FlowProducerConfig = (): RegisterQueueAsyncOptions => {
  return {
    name: UPLOAD_AVATAR_INTO_S3_FLOW_PRODUCER,
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

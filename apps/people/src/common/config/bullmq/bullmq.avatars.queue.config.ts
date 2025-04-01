import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullMQConfigService } from "./bullmq.config.service";
import { UPLOAD_AVATAR_INTO_S3_QUEUE } from "../constants";
import { RegisterQueueAsyncOptions } from "@nestjs/bullmq/dist/interfaces/register-queue-options.interface";

export const getUploadAvatarIntoS3QueueConfig = (): RegisterQueueAsyncOptions => {
  return {
    name: UPLOAD_AVATAR_INTO_S3_QUEUE,
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

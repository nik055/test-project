import { Module } from "@nestjs/common";
import { AvatarsController } from "./avatars.controller";
import { AvatarsService } from "./avatars.service";
import { AppConfigModule } from "../common/config/config.module";
import { PrismaServiceModule } from "../prisma-service/prisma-service.module";
import { FilesModule } from "../providers/files.module";
import { PeopleModule } from "../people/people.module";
import { UploadAvatarIntoS3Processor } from "./avatars.processor";
import { BullModule } from "@nestjs/bullmq";
import { getUploadAvatarIntoS3QueueConfig } from "../common/config/bullmq/bullmq.avatars.queue.config";
import { getUploadAvatarIntoS3FlowProducerConfig } from "../common/config/bullmq/bullmq.avatars.flow-producer.config";
import { TokensModule } from "../common/tokens/tokens.module";
import { AvatarValidationPipe } from "./avatars.validation-pipes";
import { AvatarsConfigService } from "./avatars.config.service";
import { ConfiguredJwtModule } from "@app/jwt-module-configured";

@Module({
  imports: [
    AppConfigModule,
    PrismaServiceModule,
    PeopleModule,
    FilesModule,
    BullModule.registerQueueAsync(getUploadAvatarIntoS3QueueConfig()),
    BullModule.registerFlowProducerAsync(getUploadAvatarIntoS3FlowProducerConfig()),
    ConfiguredJwtModule,
    TokensModule,
  ],
  controllers: [AvatarsController],
  providers: [
    AvatarsService,
    UploadAvatarIntoS3Processor,
    AvatarValidationPipe,
    AvatarsConfigService,
  ],
})
export class AvatarsModule {}

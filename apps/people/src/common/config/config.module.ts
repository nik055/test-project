import { Module } from "@nestjs/common";
import { BullMQConfigService } from "./bullmq/bullmq.config.service";
import { PeopleConfigService } from "./people/people.config.service";
import { RedisConfigService } from "./redis/redis.config.service";
import { S3ConfigService } from "./s3/s3.config.service";
import { ConfigService } from "@nestjs/config";

@Module({
  providers: [
    ConfigService,
    BullMQConfigService,
    PeopleConfigService,
    RedisConfigService,
    S3ConfigService,
  ],
  exports: [
    ConfigService,
    BullMQConfigService,
    PeopleConfigService,
    RedisConfigService,
    S3ConfigService,
  ],
})
export class AppConfigModule {}

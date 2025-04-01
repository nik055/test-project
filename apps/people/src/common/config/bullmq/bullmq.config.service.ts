import { Injectable } from "@nestjs/common";
import { RedisConfigService } from "../redis/redis.config.service";

@Injectable()
export class BullMQConfigService extends RedisConfigService {}

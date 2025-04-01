import { redisStore } from "cache-manager-redis-yet";
import { RedisConfigService } from "../redis/redis.config.service";
import { ConfigService } from "@nestjs/config";
import { ConfiguredRedisModule } from "../redis/redis.module";

export const getCacheConfig = () => {
  return {
    useFactory: async (redisConfigService: RedisConfigService) => ({
      store: await redisStore({
        socket: {
          host: redisConfigService.getHost,
          port: redisConfigService.getPort,
        },
        ttl: redisConfigService.getCacheTTL,
      }),
    }),
    isGlobal: true,
    inject: [ConfigService],
    imports: [ConfiguredRedisModule],
  };
};

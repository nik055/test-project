import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { CacheConfigService } from "./cache.config.service";
import { ConfiguredRedisModule } from "../redis/redis.module";
import { getCacheConfig } from "./cache.config";

@Module({
  imports: [ConfiguredRedisModule, CacheModule.registerAsync(getCacheConfig())],
  providers: [CacheConfigService],
  exports: [CacheModule, CacheConfigService],
})
export class ConfiguredCacheModule {}

import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CacheConfigService {
  constructor(private readonly configService: ConfigService) {}

  get getTTLWithJitter(): number {
    const baseTTL = +this.getCacheTTL;
    return baseTTL + Math.floor(Math.random() * 1000);
  }

  get getCacheTTL(): number {
    return +this.configService.get<number>("CACHE_TTL", { infer: true }) * 1000;
  }
}

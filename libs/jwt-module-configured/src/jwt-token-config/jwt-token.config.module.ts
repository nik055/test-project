import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtTokenConfigService } from "./jwt-token.config.service";

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [JwtTokenConfigService],
  exports: [JwtTokenConfigService],
})
export class JwtTokenConfigModule {}

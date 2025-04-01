import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { getJwtModuleConfig } from "./jwt.module.config";
import { JwtTokenConfigModule } from "@app/jwt-module-configured/jwt-token-config/jwt-token.config.module";

@Module({
  imports: [JwtTokenConfigModule, JwtModule.registerAsync(getJwtModuleConfig())],
  controllers: [],
  providers: [],
  exports: [JwtModule, JwtTokenConfigModule],
})
export class ConfiguredJwtModule {}

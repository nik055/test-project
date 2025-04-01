import { Module } from "@nestjs/common";
import { TokensService } from "./tokens.service";
import { AppConfigModule } from "../config/config.module";
import { ConfiguredJwtModule } from "@app/jwt-module-configured";

@Module({
  imports: [AppConfigModule, ConfiguredJwtModule],
  controllers: [],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}

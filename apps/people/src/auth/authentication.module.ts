import { AuthenticationController } from "./authentication.controller";
import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { ConfigModule } from "@nestjs/config";
import { PeopleModule } from "../people/people.module";
import { TokensModule } from "../common/tokens/tokens.module";
import { ConfiguredJwtModule } from "@app/jwt-module-configured";

@Module({
  imports: [ConfigModule, ConfiguredJwtModule, PeopleModule, TokensModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}

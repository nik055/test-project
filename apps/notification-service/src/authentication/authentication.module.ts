import { Module } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { ConfiguredJwtModule } from "@app/jwt-module-configured";

@Module({
  imports: [ConfiguredJwtModule],
  controllers: [],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}

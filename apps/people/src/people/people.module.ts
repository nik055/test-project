import { Module } from "@nestjs/common";
import { PeopleService } from "./people.service";
import { PeopleController } from "./people.controller";
import { PrismaServiceModule } from "../prisma-service/prisma-service.module";
import { PeopleConfigService } from "../common/config/people/people.config.service";
import { AppConfigModule } from "../common/config/config.module";
import { TokensModule } from "../common/tokens/tokens.module";
import { ConfiguredCacheModule } from "../common/config/cache/cache.module";
import { NatsClientModule } from "../nats-client/nats-client.module";
import { ConfiguredJwtModule } from "@app/jwt-module-configured";

@Module({
  imports: [
    AppConfigModule,
    PrismaServiceModule,
    ConfiguredJwtModule,
    TokensModule,
    ConfiguredCacheModule,
    NatsClientModule,
  ],
  controllers: [PeopleController],
  providers: [PeopleConfigService, PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}

import { Module } from "@nestjs/common";
import { PeopleModule } from "./people/people.module";
import { ConfigModule } from "@nestjs/config";
import { AvatarsModule } from "./avatars/avatars.module";
import { AuthenticationModule } from "./auth/authentication.module";
import { ConfiguredCacheModule } from "./common/config/cache/cache.module";
import { ConfiguredBullMQModule } from "./common/config/bullmq/bullmq.module";
import { ResetBalancesModule } from "./reset-balance/reset-balances.module";
import { EnvironmentVariables } from "./common/config/environment-variables";
import { configValidator } from "@app/environment-variables-validate";
import { NatsClientModule } from "./nats-client/nats-client.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: configValidator(EnvironmentVariables),
      isGlobal: true,
      envFilePath: [".env"],
    }),
    ConfiguredBullMQModule,
    AuthenticationModule,
    ConfiguredCacheModule,
    AvatarsModule,
    PeopleModule,
    ResetBalancesModule,
    NatsClientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configValidator } from "@app/environment-variables-validate";
import { EnvironmentVariables } from "./common/config/environment-variables";
import { NatsConfigModule } from "@app/nats-config/nats-config.module";
import { NotificationServiceConfig } from "./common/config/notification-service.config";
import { NotificationModule } from "./notification/notification.module";
import { WebsocketConfigModule } from "./common/websocket-config/websocket-config.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: configValidator(EnvironmentVariables),
      isGlobal: true,
      envFilePath: [".env"],
    }),
    NatsConfigModule,
    NotificationModule,
    WebsocketConfigModule,
  ],
  controllers: [],
  providers: [NotificationServiceConfig],
  exports: [WebsocketConfigModule],
})
export class NotificationServiceModule {}

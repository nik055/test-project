import { Module } from "@nestjs/common";
import { NatsConfigModule } from "@app/nats-config/nats-config.module";
import { ClientsModule } from "@nestjs/microservices";
import {
  NOTIFICATION_QUEUE,
  NOTIFICATION_SERVICE,
} from "@app/contracts/notification/constants";
import { registerClientsModuleFor } from "./nats-client.config";

@Module({
  imports: [
    NatsConfigModule,
    ClientsModule.registerAsync(
      registerClientsModuleFor(NOTIFICATION_SERVICE, NOTIFICATION_QUEUE),
    ),
  ],
  controllers: [],
  providers: [],
  exports: [ClientsModule],
})
export class NatsClientModule {}

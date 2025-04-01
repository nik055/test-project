import { Transport } from "@nestjs/microservices";
import {
  NOTIFICATION_QUEUE,
  NOTIFICATION_SERVICE,
} from "@app/contracts/notification/constants";
import { NatsConfigService } from "@app/nats-config/nats-config.service";
import { NatsOptions } from "@nestjs/microservices/interfaces/microservice-configuration.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationServiceConfig {
  constructor(private readonly natsConfigService: NatsConfigService) {}

  get get(): NatsOptions {
    return {
      transport: Transport.NATS,
      options: {
        name: NOTIFICATION_SERVICE,
        servers: [this.natsConfigService.getNatsServers],
        queue: NOTIFICATION_QUEUE,
      },
    };
  }
}

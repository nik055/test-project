import { ClientsModuleAsyncOptions } from "@nestjs/microservices/module/interfaces";
import { Transport } from "@nestjs/microservices";
import { NatsConfigService } from "@app/nats-config/nats-config.service";
import { NatsOptions } from "@nestjs/microservices/interfaces/microservice-configuration.interface";
import { NatsConfigModule } from "@app/nats-config";

export const registerClientsModuleFor = (
  serviceName: string,
  queue: string,
): ClientsModuleAsyncOptions => {
  return [
    {
      name: serviceName,
      useFactory: async (configService: NatsConfigService): Promise<NatsOptions> => ({
        transport: Transport.NATS,
        options: {
          name: serviceName,
          servers: configService.getNatsServers,
          user: configService.getNatsUsername,
          pass: configService.getNatsPassword,
          queue,
        },
      }),
      inject: [NatsConfigService],
      imports: [NatsConfigModule],
    },
  ];
};

import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ValidationPipeConfig } from "@app/validation-pipe-config";
import { NotificationServiceModule } from "./notification-service.module";
import { NotificationServiceConfig } from "./common/config/notification-service.config";
import { NotificationGateway } from "./notification/notification.gateway";
import { WebsocketConfigService } from "./common/websocket-config/websocket-config.service";
import { MicroserviceOptions } from "@nestjs/microservices/interfaces/microservice-configuration.interface";

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(
    NotificationServiceModule,
  );

  const notificationServiceConfig: MicroserviceOptions = appContext.get(
    NotificationServiceConfig,
  ).get;
  const webSocketPort: number = appContext.get(WebsocketConfigService).webSocketPort;

  const app = await NestFactory.create(NotificationServiceModule);

  app.useGlobalPipes(new ValidationPipe(ValidationPipeConfig));
  app.get(NotificationGateway);
  app.connectMicroservice(notificationServiceConfig);
  // app.useGlobalFilters(new NatsExceptionFilter());

  await app.startAllMicroservices();
  await app.listen(webSocketPort);

  Logger.log(`🚀 WebSocket Gateway is running on port ${webSocketPort}`);
  Logger.log(`🚀 Notification Service is running`);
}

bootstrap();

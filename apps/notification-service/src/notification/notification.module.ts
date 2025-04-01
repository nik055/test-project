import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationGateway } from "./notification.gateway";
import { AuthenticationModule } from "../authentication/authentication.module";

@Module({
  imports: [AuthenticationModule],
  controllers: [NotificationController],
  providers: [NotificationGateway],
  exports: [],
})
export class NotificationModule {}

import { Controller, Logger } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { PingPongContract } from "@app/contracts/ping-pong";
import { TransferMoneyContract, TransferMoneyDto } from "@app/contracts/transfer-money";
import { NotificationGateway } from "./notification.gateway";
import {
  createNotificationMessageForMoneyReceiver,
  createNotificationMessageForMoneySender,
} from "./notification.messages";

@Controller()
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);
  constructor(private readonly notificationGateway: NotificationGateway) {}

  @MessagePattern(PingPongContract.pattern)
  async pong(
    @Payload() request: PingPongContract.Request,
  ): Promise<PingPongContract.Response> {
    const { ping } = request;
    this.logger.log(`Received: ${ping}`);
    return { pong: "smb" };
  }

  @EventPattern(TransferMoneyContract.pattern)
  async sendNotificationsToUsers(dto: TransferMoneyDto): Promise<void> {
    this.logger.log(`Received transfer money event`);
    const { userIdSendingMoney, userIdReceivingMoney, amountToTransfer } = dto;

    this.logger.log(`Received transfer money event from user ${dto.userIdSendingMoney}`);
    this.notificationGateway.handleSendNotificationToUser(
      userIdSendingMoney,
      createNotificationMessageForMoneySender(userIdReceivingMoney, amountToTransfer),
    );
    this.logger.log(`Notification sent successfully to user ${dto.userIdSendingMoney}`);

    this.logger.log(`Received transfer money event for user ${dto.userIdReceivingMoney}`);
    this.notificationGateway.handleSendNotificationToUser(
      userIdReceivingMoney,
      createNotificationMessageForMoneyReceiver(userIdSendingMoney, amountToTransfer),
    );
    this.logger.log(`Notification sent successfully to user ${dto.userIdReceivingMoney}`);
  }
}

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { AuthenticationService } from "../authentication/authentication.service";
import { getWebsocketConfig } from "../common/websocket-config/websocket-config";

@WebSocketGateway(getWebsocketConfig())
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer() server: Server;

  constructor(private readonly authenticationService: AuthenticationService) {}

  async handleConnection(socket: Socket) {
    this.logger.log(`Client connected: ${socket.id}`);

    try {
      const extractedUserId =
        await this.authenticationService.validateAuthentication(socket);

      this.createRoom(socket, extractedUserId);
    } catch (error) {
      this.logger.error(
        `Error validating client authorization : ${socket.id} - ${error.message}`,
      );
      socket.emit("error", "Unauthorized");
      socket.disconnect();
    }
  }

  private async createRoom(client: Socket, userId: string): Promise<void> {
    this.logger.log(`Creating room for user ${userId}`);

    client.join(userId);

    this.logger.log(`Room for the user ${userId} is opened`);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleSendNotificationToUser(room: string, notificationMessage: string) {
    this.logger.log(`Sending notification to the room: ${room}`);

    this.server.to(room).emit("notification", notificationMessage);

    this.logger.log(`Notification sent to the room: ${room}`);
  }
}

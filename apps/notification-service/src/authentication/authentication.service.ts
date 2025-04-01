import { Injectable, Logger } from "@nestjs/common";
import { Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(private readonly jwtService: JwtService) {}

  async validateAuthentication(socket: Socket): Promise<string> {
    this.logger.log(`Authentication validation for client id: ${socket.id}`);

    const authHeader = await this.extractAuthHeader(socket);
    const userId = await this.validateJwtToken(authHeader);

    this.logger.log(
      `Authentication validation completed successfully for client id: ${socket.id}`,
    );
    return userId;
  }

  private async extractAuthHeader(socket: Socket): Promise<any> {
    this.logger.log(`Extracting authentication header from client id: ${socket.id}`);

    const authHeader = socket.handshake.headers.authorization;
    if (!authHeader) {
      this.logger.error("No authentication header provided");
      throw new Error("No authentication header provided");
    }

    console.log(authHeader);

    this.logger.log(`Authentication header extracted from client id: ${socket.id}`);
    return authHeader;
  }

  private async validateJwtToken(authHeader: any): Promise<string> {
    this.logger.log("Validating JWT token");

    const verifiedToken = await this.jwtService.verify(authHeader);
    this.logger.log(`Client id from JWT validated token: ${verifiedToken.id}`);

    this.logger.log("JWT token validated");
    return verifiedToken.id;
  }
}

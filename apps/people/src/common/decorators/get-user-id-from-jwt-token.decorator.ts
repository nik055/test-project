import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";

export const GetUserIdFromJwtToken = createParamDecorator(
  async (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("No token found");
    }

    return extractUserIdFromToken(token);
  },
);

const extractTokenFromHeader = (request: Request): string | undefined => {
  const [type, token] = request.headers.authorization?.split(" ") ?? [];
  return type === "Bearer" ? token : undefined;
};

const extractUserIdFromToken = (token: string): string => {
  try {
    const jwtService = new JwtService({});
    return jwtService.decode(token).id;
  } catch (error) {
    throw new UnauthorizedException("Invalid token");
  }
};

import { Body, Controller, Post } from "@nestjs/common";
import {
  AuthenticationService,
  IAccessToken,
  ILoginData,
} from "./authentication.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthenticationEndpointResponses } from "../swagger/authentication.endpoints.responses";

@ApiTags("Authentication")
@Controller("auth")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiOperation({ summary: "Login" })
  @ApiResponse(AuthenticationEndpointResponses.response201)
  @ApiResponse(AuthenticationEndpointResponses.response400)
  @ApiResponse(AuthenticationEndpointResponses.response500)
  @Post("login")
  async login(@Body() data: ILoginData): Promise<IAccessToken> {
    return await this.authenticationService.login(data);
  }
}

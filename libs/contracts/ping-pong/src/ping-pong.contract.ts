import { IsString } from "class-validator";

export namespace PingPongContract {
  export const pattern = { cmd: "ping" };

  export class Request {
    @IsString()
    ping: string;
  }

  export class Response {
    pong: string;
  }
}

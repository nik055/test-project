import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EnvironmentVariables {
  @IsString({ message: "NATS_SERVERS must be a string" })
  @IsNotEmpty({ message: "NATS_SERVERS is required" })
  readonly NATS_SERVERS: string;

  @IsString({ message: "NATS_USERNAME must be a string" })
  @IsNotEmpty({ message: "NATS_USERNAME is required" })
  readonly NATS_USERNAME: string;

  @IsString({ message: "NATS_PASSWORD must be a string" })
  @IsNotEmpty({ message: "NATS_PASSWORD is required" })
  readonly NATS_PASSWORD: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "NATS_PORT value must be a number" },
  )
  @IsNotEmpty({ message: "NATS_PORT is required" })
  readonly NATS_PORT: number;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "WEBSOCKET_PORT value must be a number" },
  )
  @IsNotEmpty({ message: "WEBSOCKET_PORT is required" })
  readonly WEBSOCKET_PORT: number;

  @IsString({ message: "WEBSOCKET_NAMESPACE must be a string" })
  @IsNotEmpty({ message: "WEBSOCKET_NAMESPACE is required" })
  readonly WEBSOCKET_NAMESPACE: string;
}

import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class EnvironmentVariables {
  @IsNumber()
  @Min(1000, { message: "Minimal PORT value is 1000" })
  @Max(65535, { message: "Maximal PORT value is 65535" })
  @IsNotEmpty({ message: "PORT is required" })
  readonly PORT: number;

  @IsString({ message: "DATABASE_URL must be a string" })
  @IsNotEmpty({ message: "DATABASE_URL is required" })
  readonly DATABASE_URL: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "SALT value must be a number" },
  )
  @IsNotEmpty({ message: "SALT is required" })
  readonly SALT: number;

  @IsString({ message: "JWT_SECRET must be a string" })
  @IsNotEmpty({ message: "JWT_SECRET is required" })
  readonly JWT_SECRET: string;

  @IsString({ message: "JWT_EXPIRES_IN must be a string" })
  @IsNotEmpty({ message: "JWT_EXPIRES_IN is required" })
  readonly JWT_EXPIRES_IN: string;

  @IsString({ message: "REDIS_HOST must be a string" })
  @IsNotEmpty({ message: "REDIS_HOST is required" })
  readonly REDIS_HOST: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "REDIS_PORT value must be a number" },
  )
  @IsNotEmpty({ message: "REDIS_PORT is required" })
  readonly REDIS_PORT: number;

  @IsString({ message: "S3_ENDPOINT must be a string" })
  @IsNotEmpty({ message: "S3_ENDPOINT is required" })
  readonly S3_ENDPOINT: string;

  @IsString({ message: "S3_REGION must be a string" })
  @IsNotEmpty({ message: "S3_REGION is required" })
  readonly S3_REGION: string;

  @IsString({ message: "S3_BUCKET_NAME must be a string" })
  @IsNotEmpty({ message: "S3_BUCKET_NAME is required" })
  readonly S3_BUCKET_NAME: string;

  @IsString({ message: "S3_ACCESS_KEY must be a string" })
  @IsNotEmpty({ message: "S3_ACCESS_KEY is required" })
  readonly S3_ACCESS_KEY: string;

  @IsString({ message: "S3_SECRET_KEY must be a string" })
  @IsNotEmpty({ message: "S3_SECRET_KEY is required" })
  readonly S3_SECRET_KEY: string;

  @IsString({ message: "AVATAR_MAX_SIZE must be a string" })
  @IsNotEmpty({ message: "AVATAR_MAX_SIZE is required" })
  readonly AVATAR_MAX_SIZE: string;

  @IsString({ message: "AVATAR_FILE_TYPES must be a string" })
  @IsNotEmpty({ message: "AVATAR_FILE_TYPES is required" })
  readonly AVATAR_FILE_TYPES: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "CACHE_TTL value must be a number" },
  )
  @IsNotEmpty({ message: "CACHE_TTL is required" })
  readonly CACHE_TTL: number;

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
}

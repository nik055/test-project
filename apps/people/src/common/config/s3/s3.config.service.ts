import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class S3ConfigService {
  constructor(private readonly configService: ConfigService) {}

  get getEndpoint(): string {
    return this.configService.get<string>("S3_ENDPOINT", { infer: true });
  }

  get getRegion(): string {
    return this.configService.get<string>("S3_REGION", { infer: true });
  }

  get getBucketName(): string {
    return this.configService.get<string>("S3_BUCKET_NAME", { infer: true });
  }

  get getAccessKey(): string {
    return this.configService.get<string>("S3_ACCESS_KEY", { infer: true });
  }

  get getSecretKey(): string {
    return this.configService.get<string>("S3_SECRET_KEY", { infer: true });
  }
}

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AvatarsConfigService {
  constructor(private readonly configService: ConfigService) {}

  get getAvatarMaxSize(): number {
    return this.configService.get<number>("AVATAR_MAX_SIZE", { infer: true });
  }

  get getAvatarFileTypes(): string {
    return this.configService.get<string>("AVATAR_FILE_TYPES", { infer: true });
  }
}

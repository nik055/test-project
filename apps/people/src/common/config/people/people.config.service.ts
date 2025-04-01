import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PeopleConfigService {
  constructor(private readonly configService: ConfigService) {}

  get getSalt(): string {
    return this.configService.get<number>("SALT", { infer: true });
  }
}

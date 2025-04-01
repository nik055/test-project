import { Processor } from "@nestjs/bullmq";
import { RESET_BALANCE_QUEUE } from "./config/constants";
import { AbstractProcessor } from "../avatars/abstract.processor";
import { PeopleService } from "../people/people.service";

@Processor(RESET_BALANCE_QUEUE)
export class ResetBalancesProcessor extends AbstractProcessor {
  constructor(private readonly peopleService: PeopleService) {
    super();
  }

  async process(): Promise<void> {
    this.logger.log("🔄 Resetting balance process has started");
    try {
      await this.peopleService.resetBalanceForEveryone();
      this.logger.log("✅ Resetting balance process has finished successfully");
    } catch (error) {
      throw error;
    }
  }
}

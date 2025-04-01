import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { RESET_BALANCE_QUEUE, RESET_BALANCE_QUEUE_JOB } from "./config/constants";

@Injectable()
export class ResetBalancesService {
  private readonly logger = new Logger(ResetBalancesService.name);

  constructor(
    @InjectQueue(RESET_BALANCE_QUEUE) private readonly resetBalanceQueue: Queue,
  ) {}

  async resetBalanceForEveryone(): Promise<void> {
    this.logger.log("🔄 Beginning of resetting balance for everyone");

    try {
      await this.resetBalanceQueue.add(
        RESET_BALANCE_QUEUE_JOB,
        {},
        { removeOnComplete: true },
      );
      this.logger.log("✅ Reset balance for everyone job has been added to the queue");
    } catch (error) {
      this.logger.error(`❌ Failed to reset balance for everyone: ${error.message}`);
      throw error;
    }
  }
}

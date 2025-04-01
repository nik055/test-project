import { Module } from "@nestjs/common";
import { PeopleModule } from "../people/people.module";
import { ResetBalancesService } from "./reset-balances.service";
import { ResetBalancesController } from "./reset-balances.controller";
import { BullModule } from "@nestjs/bullmq";
import { getResetBalanceQueueConfig } from "./config/reset-balances-queue.config";
import { getResetBalanceFlowProducerConfig } from "./config/reset-balances-flow-producer.config";
import { TokensModule } from "../common/tokens/tokens.module";
import { ResetBalancesProcessor } from "./reset-balances.processor";
import { ConfiguredJwtModule } from "@app/jwt-module-configured";

@Module({
  imports: [
    PeopleModule,
    BullModule.registerQueueAsync(getResetBalanceQueueConfig()),
    BullModule.registerFlowProducerAsync(getResetBalanceFlowProducerConfig()),
    ConfiguredJwtModule,
    TokensModule,
  ],
  controllers: [ResetBalancesController],
  providers: [ResetBalancesService, ResetBalancesProcessor],
  exports: [],
})
export class ResetBalancesModule {}

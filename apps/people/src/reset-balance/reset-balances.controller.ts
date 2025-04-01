import { Controller, Patch, UseGuards } from "@nestjs/common";
import { RolesGuard } from "../common/guards/roles.guard";
import { AuthenticationGuard } from "../common/guards/authentication.guard";
import { ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ResetBalancesService } from "./reset-balances.service";
import { Roles } from "../common/decorators/roles.decorator";
import { $Enums } from "@prisma/client";

@ApiTags("Reset Balance")
@ApiSecurity("bearerAuth")
@Controller("reset-balances")
@UseGuards(AuthenticationGuard, RolesGuard)
export class ResetBalancesController {
  constructor(private readonly resetBalanceService: ResetBalancesService) {}

  @ApiOperation({ summary: "Resets the balance for everyone" })
  @Patch("/everyone")
  @Roles($Enums.Roles.ADMIN)
  async resetBalanceForEveryone() {
    return await this.resetBalanceService.resetBalanceForEveryone();
  }
}

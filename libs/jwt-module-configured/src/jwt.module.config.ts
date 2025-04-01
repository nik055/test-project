import { JwtModuleAsyncOptions } from "@nestjs/jwt/dist/interfaces/jwt-module-options.interface";
import { JwtTokenConfigService } from "@app/jwt-module-configured/jwt-token-config/jwt-token.config.service";
import { JwtTokenConfigModule } from "@app/jwt-module-configured/jwt-token-config/jwt-token.config.module";

export const getJwtModuleConfig = (): JwtModuleAsyncOptions => {
  return {
    useFactory: (jwtConfigService: JwtTokenConfigService) => ({
      global: true,
      secret: jwtConfigService.getSecret,
      signOptions: {
        expiresIn: jwtConfigService.getExpiresIn,
      },
    }),
    inject: [JwtTokenConfigService],
    imports: [JwtTokenConfigModule],
  };
};

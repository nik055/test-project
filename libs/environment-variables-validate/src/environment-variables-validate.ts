import { ClassConstructor, plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

export function configValidator<T extends object>(
  configClass: ClassConstructor<T>,
): (config: Record<string, any>) => T {
  return (config: Record<string, any>) => {
    return validateEnvConfigGeneric(config, configClass);
  };
}

function validateEnvConfigGeneric<T extends object>(
  config: Record<string, unknown>,
  configClass: ClassConstructor<T>,
): T {
  const validatedConfig = plainToInstance(configClass, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

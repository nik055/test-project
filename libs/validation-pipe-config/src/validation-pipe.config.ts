import { ValidationError } from "class-validator";
import { BadRequestException } from "@nestjs/common";

export const ValidationPipeConfig = {
  exceptionFactory: (validationErrors: ValidationError[] = []) => {
    const messages = validationErrors
      .map(error => Object.values(error.constraints))
      .flat()
      .join(". ");

    return new BadRequestException(messages);
  },
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: false,

  disableErrorMessages: false,

  validationError: {
    value: false,
  },

  transform: true,
};

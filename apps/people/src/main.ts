import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule } from "@nestjs/swagger";
import { getDocumentFactory } from "./common/config/swagger/swagger.config";
import { HttpExceptionFilter } from "@app/http-exception-filter";
import { ValidationPipeConfig } from "@app/validation-pipe-config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get("PORT");

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe(ValidationPipeConfig));

  SwaggerModule.setup("swagger", app, getDocumentFactory(app), {
    jsonDocumentUrl: "swagger/json",
  });

  await app.listen(port);
  Logger.log(`🚀 Application is running on the port ${port}`);
}
bootstrap();

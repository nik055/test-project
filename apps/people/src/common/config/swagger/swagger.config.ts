import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";

export const getDocumentFactory = (app: INestApplication) =>
  SwaggerModule.createDocument(app, SwaggerConfig);

const SwaggerConfig = new DocumentBuilder()
  .setTitle("People app")
  .setDescription("The people API description")
  .setVersion("1.0")
  .addTag("people")
  .build();

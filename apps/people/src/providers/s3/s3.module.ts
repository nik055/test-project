import { Module } from "@nestjs/common";
import { AppConfigModule } from "../../common/config/config.module";
import { S3Service } from "./s3.service";
import { S3Lib } from "./constants/constants";
import { getS3Factory } from "../../common/config/s3/s3.config";

@Module({
  imports: [AppConfigModule],
  providers: [
    S3Service,
    {
      provide: S3Lib,
      ...getS3Factory(),
    },
  ],
  exports: [S3Service, S3Lib],
})
export class S3Module {}

import { Module } from "@nestjs/common";
import { IFileService } from "./files.adapter";
import { S3Module } from "./s3/s3.module";
import { S3Service } from "./s3/s3.service";
import { AppConfigModule } from "../common/config/config.module";

@Module({
  imports: [S3Module, AppConfigModule],
  providers: [
    {
      provide: IFileService,
      useClass: S3Service,
    },
  ],
  exports: [IFileService],
})
export class FilesModule {}

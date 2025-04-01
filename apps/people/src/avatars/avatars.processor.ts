import { UPLOAD_AVATAR_INTO_S3_QUEUE } from "../common/config/constants";
import { Processor } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { AbstractProcessor } from "./abstract.processor";
import { IFileService } from "../providers/files.adapter";

export interface IUploadFile {
  path: string;
  name: string;
  file: any;
}

@Processor(UPLOAD_AVATAR_INTO_S3_QUEUE)
export class UploadAvatarIntoS3Processor extends AbstractProcessor {
  constructor(private readonly fileService: IFileService) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log("🔄 Upload avatar into S3 process has started");
    try {
      this.logger.log("🖼️ Beginning of loading avatar into S3");

      await this.uploadFileToS3(job.data);
      this.logger.log("✅ Upload avatar into S3 process has finished successfully");
    } catch (error) {
      throw error;
    }
  }

  private async uploadFileToS3(data: IUploadFile): Promise<string> {
    const { path, name, file } = data;
    const buffer: Buffer = await this.getBufferFromFile(file);

    const uploadResult = await this.fileService.uploadFile({
      folder: path,
      file: { ...file, buffer },
      name,
    });
    console.log(`✅ File uploaded to S3 successfully: ${uploadResult}`);
    return uploadResult.path;
  }

  private async getBufferFromFile(file: any): Promise<Buffer> {
    if (!file || !file.buffer?.data) {
      throw new Error("❌ File buffer is invalid or missing.");
    }
    return Buffer.from(file.buffer.data);
  }
}

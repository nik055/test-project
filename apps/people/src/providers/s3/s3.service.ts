import { Inject, Injectable, Logger } from "@nestjs/common";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { S3ConfigService } from "../../common/config/s3/s3.config.service";
import { S3Lib } from "./constants/constants";
import { UploadFilePayloadDto } from "./dtos/upload-file-payload.dto";
import { UploadFileResultDto } from "./dtos/upload-file-result.dto";
import { RemoveFilePayloadDto } from "./dtos/remove-file-payload.dto";

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly bucketName: string;

  constructor(
    @Inject(S3Lib) private readonly s3Client: S3Client,
    private readonly s3ConfigService: S3ConfigService,
  ) {
    this.bucketName = this.s3ConfigService.getBucketName;
  }

  async uploadFile(dto: UploadFilePayloadDto): Promise<UploadFileResultDto> {
    const { folder, file, name } = dto;
    const path = `${folder}/${name}`;
    const contentLength = Buffer.byteLength(file.buffer);

    this.logger.log("📁 Beginning of uploading file to bucket");

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: path,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: contentLength,
      ACL: "public-read",
    });

    try {
      await this.s3Client.send(command);
      this.logger.log(`✅ File uploaded successfully: ${path}`);
      return { path };
    } catch (error) {
      this.logger.error(`❌ File upload error: ${error.message}`);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  async removeFile(dto: RemoveFilePayloadDto): Promise<void> {
    const { path } = dto;

    this.logger.log("🗑️ Beginning of removing file from bucket");

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: path,
    });

    try {
      await this.s3Client.send(command);
      this.logger.log(`✅ File removed successfully: ${path}`);
    } catch (error) {
      this.logger.error(`❌ File remove error: ${error.message}`);
      throw new Error(`File removal failed: ${error.message}`);
    }
  }
}

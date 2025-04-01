import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { AvatarsConfigService } from "./avatars.config.service";
import { IUploadedMulterFile } from "../providers/s3/interfaces/upload-file.interface";

const DefaultAvatarMaxSize = 10485760; // 10 MB
const DefaultAvatarFileTypes = "png|jpeg|jpg";

@Injectable()
export class AvatarValidationPipe implements PipeTransform {
  private allowedMimeTypes: string[];
  private maxFileSize: number;

  constructor(private readonly configService: AvatarsConfigService) {
    this.maxFileSize = +this.getAvatarMaxSize();
    this.allowedMimeTypes = this.getMimeTypes()
      .split("|")
      .map(ext => `image/${ext}`);
  }

  transform(file: IUploadedMulterFile): IUploadedMulterFile {
    if (!file) throw new BadRequestException("File is required.");

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(", ")}.`,
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds the limit of ${this.maxFileSize / (1024 * 1024)} MB.`,
      );
    }

    return file;
  }

  private getAvatarMaxSize(): number {
    const maxSize: number = +this.configService.getAvatarMaxSize * 1024 * 1024;
    return maxSize || DefaultAvatarMaxSize;
  }

  private getMimeTypes(): string {
    return this.configService.getAvatarFileTypes || DefaultAvatarFileTypes;
  }
}

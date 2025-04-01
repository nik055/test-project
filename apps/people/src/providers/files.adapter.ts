import { UploadFilePayloadDto } from "./s3/dtos/upload-file-payload.dto";
import { UploadFileResultDto } from "./s3/dtos/upload-file-result.dto";
import { RemoveFilePayloadDto } from "./s3/dtos/remove-file-payload.dto";

export abstract class IFileService {
  abstract uploadFile(dto: UploadFilePayloadDto): Promise<UploadFileResultDto>;

  abstract removeFile(dto: RemoveFilePayloadDto): Promise<void>;
}

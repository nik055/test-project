import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AvatarsService } from "./avatars.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { IUploadedMulterFile } from "../providers/s3/interfaces/upload-file.interface";
import { CreateAvatarResultDto } from "./dtos/create-avatar-result.dto";
import { AvatarValidationPipe } from "./avatars.validation-pipes";
import { GetUserIdFromJwtToken } from "../common/decorators/get-user-id-from-jwt-token.decorator";
import { AuthenticationGuard } from "../common/guards/authentication.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";
import { DeleteAvatarResultDto } from "./dtos/delete-avatar-result.dto";
import { SoftDeleteAvatarResultDto } from "./dtos/soft-delete-avatar-result.dto";

@ApiTags("Avatars")
@ApiSecurity("bearerAuth")
@Controller("avatars")
@UseGuards(AuthenticationGuard, RolesGuard)
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async saveAvatar(
    @GetUserIdFromJwtToken() personId: string,
    @UploadedFile(AvatarValidationPipe) file: IUploadedMulterFile,
  ): Promise<CreateAvatarResultDto> {
    return await this.avatarsService.saveAvatar({ personId, file });
  }

  @Delete(":avatarName")
  async deleteAvatar(
    @GetUserIdFromJwtToken() personId: string,
    @Param("avatarName") avatarName: string,
  ): Promise<DeleteAvatarResultDto> {
    return await this.avatarsService.deleteAvatar({ personId, avatarName });
  }

  @Delete("/soft/:avatarName")
  async softDeleteAvatar(
    @GetUserIdFromJwtToken() personId: string,
    @Param("avatarName") avatarName: string,
  ): Promise<SoftDeleteAvatarResultDto> {
    return await this.avatarsService.softDeleteAvatar({ personId, avatarName });
  }
}

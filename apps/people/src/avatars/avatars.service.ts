import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { IUploadedMulterFile } from "../providers/s3/interfaces/upload-file.interface";
import { IFileService } from "../providers/files.adapter";
import { PrismaService } from "../prisma-service/prisma-service.service";
import { Avatar } from "../../prisma/generated/avatar";
import { plainToInstance } from "class-transformer";
import { CreateAvatarResultDto } from "./dtos/create-avatar-result.dto";
import { Prisma } from "@prisma/client";
import { PeopleService } from "../people/people.service";
import { InjectQueue } from "@nestjs/bullmq";
import {
  UPLOAD_AVATAR_INTO_S3_JOB,
  UPLOAD_AVATAR_INTO_S3_QUEUE,
} from "../common/config/constants";
import { Queue } from "bullmq";
import { createId } from "@paralleldrive/cuid2";
import { DeleteAvatarResultDto } from "./dtos/delete-avatar-result.dto";
import { SoftDeleteAvatarResultDto } from "./dtos/soft-delete-avatar-result.dto";

export interface ISaveAvatarData {
  personId: string;
  file: IUploadedMulterFile;
  path?: string;
  name?: string;
  savedAvatarPath?: string;
  tx?: Prisma.TransactionClient;
}

export interface IDeleteAvatarData {
  personId: string;
  avatarName: string;
  path?: string;
  tx?: Prisma.TransactionClient;
}

@Injectable()
export class AvatarsService {
  private readonly logger = new Logger(AvatarsService.name);

  constructor(
    @InjectQueue(UPLOAD_AVATAR_INTO_S3_QUEUE)
    private readonly avatarsQueue: Queue,
    private readonly fileService: IFileService,
    private readonly prismaService: PrismaService,
    private readonly peopleService: PeopleService,
  ) {}

  async saveAvatar(data: ISaveAvatarData): Promise<CreateAvatarResultDto> {
    this.logger.log("🖼️ Beginning of creating avatar");

    const { personId, file } = data;
    const name = createId();

    try {
      const result: CreateAvatarResultDto = await this.saveAvatarIntoPostgresTransaction({
        name,
        personId,
      });

      if (result) {
        this.saveAvatarIntoS3({
          path: personId,
          name,
          file,
        });
        return result;
      }
    } catch (error) {
      this.logger.error(`❌ Failed to create avatar: ${error.message}`);
      throw error;
    }
  }

  private createAvatarPath(personId: string, avatarName: string): string {
    return `${personId.trim()}/${avatarName.trim()}`;
  }

  private async saveAvatarIntoPostgresTransaction(
    data: Partial<ISaveAvatarData>,
  ): Promise<CreateAvatarResultDto> {
    this.logger.log("📁 Beginning of transaction saving avatar into Postgres");

    const { name, personId } = data;
    const savedAvatarPath: string = this.createAvatarPath(personId, name);

    return this.prismaService.$transaction(async tx => {
      await this.peopleService.validatePersonBeforePhotoSaving({
        tx: this.prismaService,
        personId,
      });

      const avatar: Avatar = await this.saveAvatarIntoPostgres({
        tx,
        savedAvatarPath,
        name,
        personId,
      });

      await this.peopleService.increaseUserActiveAvatarsCount({
        tx,
        personId,
      });

      this.logger.log("✅ Avatar saved into Postgres successfully");
      this.logger.log("✅ Transaction saving avatar into Postgres finished successfully");

      return plainToInstance(CreateAvatarResultDto, avatar, {
        enableImplicitConversion: true,
      });
    });
  }

  private async saveAvatarIntoPostgres(data: Partial<ISaveAvatarData>): Promise<Avatar> {
    this.logger.log("📁 Beginning of saving avatar into Postgres");

    const { tx, savedAvatarPath, name, personId } = data;

    const createdAvatar = await tx.avatar
      .create({
        data: {
          path: savedAvatarPath,
          name,
          personId,
          isDeleted: false,
        },
      })
      .catch(error => {
        this.logger.error(`❌ Failed to save avatar into Postgres: ${error.message}`);
        error.message;
      });

    if (createdAvatar) return createdAvatar;
  }

  private saveAvatarIntoS3(data: Partial<ISaveAvatarData>): void {
    this.logger.log("🖼️ Adding avatar upload job to queue");

    const { path, name, file } = data;

    try {
      this.avatarsQueue.add(
        UPLOAD_AVATAR_INTO_S3_JOB,
        {
          path,
          name,
          file,
        },
        { removeOnComplete: true },
      );
      this.logger.log("✅ Avatar upload job added to queue successfully");
    } catch (error) {
      this.logger.error("❌ Failed to add avatar upload job to queue");
      throw error;
    }
  }

  async deleteAvatar(data: IDeleteAvatarData): Promise<DeleteAvatarResultDto> {
    this.logger.log("🗑️ Beginning of deleting avatar");

    const { personId, avatarName } = data;
    const path = this.createAvatarPath(personId, avatarName);

    try {
      const transactionResult = await this.deleteAvatarFromPostgresTransaction({
        path,
        personId,
      });
      this.logger.log("✅ Transaction deleting avatar finished successfully");

      this.deleteAvatarFromS3(path);
      this.logger.log("✅ Avatar deleted from S3 successfully");

      return transactionResult;
    } catch (error) {
      this.logger.error(`❌ Failed to delete avatar: ${error.message}`);
      throw error;
    }
  }

  private deleteAvatarFromS3(path: string) {
    this.logger.log("🗑️ Beginning of deleting avatar from S3");

    this.fileService.removeFile({ path }).catch(error => {
      this.logger.error(`❌ Failed to delete avatar from S3: ${error.message}`);
      error.message;
    });
  }

  async softDeleteAvatar(data: IDeleteAvatarData): Promise<SoftDeleteAvatarResultDto> {
    this.logger.log("🗑️ Beginning of soft deleting avatar");

    const { personId, avatarName } = data;
    const path = this.createAvatarPath(personId, avatarName);

    try {
      const transactionResult = await this.softDeleteAvatarFromPostgresTransaction({
        path,
        personId,
      });
      this.logger.log("✅ Transaction soft deleting avatar finished successfully");

      return transactionResult;
    } catch (error) {
      this.logger.error(`❌ Failed to soft delete avatar: ${error.message}`);
      throw error;
    }
  }

  private async deleteAvatarFromPostgresTransaction(
    data: Partial<IDeleteAvatarData>,
  ): Promise<DeleteAvatarResultDto> {
    this.logger.log("🗑️ Beginning of transaction deleting avatar from Postgres");

    const { path, personId } = data;

    const result = this.prismaService.$transaction(async tx => {
      this.logger.log("🗑️ Beginning of deleting avatar from Postgres");

      const avatar = await tx.avatar
        .findUniqueOrThrow({
          where: {
            path,
          },
        })
        .catch(() => {
          throw new BadRequestException(
            `Avatar with path "${path}" not found in the database.`,
          );
        });

      try {
        if (avatar.isDeleted) {
          await tx.avatar.delete({
            where: {
              path,
            },
          });
        } else {
          await tx.avatar.delete({
            where: {
              path,
            },
          });

          await this.peopleService.decreaseUserActiveAvatarsCount({
            tx,
            personId,
          });
        }
        this.logger.log("✅ Avatar deleted from Postgres successfully");
      } catch (error) {
        this.logger.error(`❌ Failed to delete avatar from Postgres: ${error.message}`);
        throw error;
      }

      this.logger.log("✅ Avatar deleted from Postgres successfully");

      this.logger.log("✅ Active avatars count decreased successfully");
    });

    if (result) {
      return plainToInstance(DeleteAvatarResultDto, result, {
        enableImplicitConversion: true,
      });
    }
  }

  private async softDeleteAvatarFromPostgresTransaction(
    data: Partial<IDeleteAvatarData>,
  ): Promise<DeleteAvatarResultDto> {
    this.logger.log("🗑️ Beginning of transaction soft deleting avatar from Postgres");

    const { path, personId } = data;

    const result = this.prismaService.$transaction(async tx => {
      await this.softDeleteAvatarFromPostgres({
        tx,
        path,
      });
      this.logger.log("✅ Avatar soft deleted from Postgres successfully");

      await this.peopleService.decreaseUserActiveAvatarsCount({
        tx,
        personId,
      });
      this.logger.log("✅ Active avatars count decreased successfully");
    });

    if (result) {
      return plainToInstance(DeleteAvatarResultDto, result, {
        enableImplicitConversion: true,
      });
    }
  }

  private async softDeleteAvatarFromPostgres(
    data: Partial<IDeleteAvatarData>,
  ): Promise<void> {
    this.logger.log("🗑️ Beginning of soft deleting avatar from Postgres");

    const { tx, path } = data;

    const avatar = await tx.avatar.findUnique({
      where: {
        path,
      },
    });
    if (!avatar) {
      throw new BadRequestException(
        `Avatar with path "${path}" not found in the database.`,
      );
    }

    try {
      await tx.avatar.update({
        where: {
          path,
        },
        data: {
          isDeleted: true,
        },
      });
      this.logger.log("✅ Avatar soft deleted from Postgres successfully");
    } catch (error) {
      this.logger.error(
        `❌ Failed to soft delete avatar from Postgres: ${error.message}`,
      );
      throw error;
    }
  }
}

import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UseInterceptors,
} from "@nestjs/common";
import { PrismaService } from "../prisma-service/prisma-service.service";
import { Person, Prisma, Roles } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaErrorHandler } from "../common/decorators/prisma-error-handler.decorator";
import { PeopleConfigService } from "../common/config/people/people.config.service";
import { IDeleteAvatarData, ISaveAvatarData } from "../avatars/avatars.service";
import { CACHE_MANAGER, CacheInterceptor } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { CacheConfigService } from "../common/config/cache/cache.config.service";
import { TransferMoneyDto } from "@app/contracts/transfer-money/dtos/transfer-money.dto";
import { plainToInstance } from "class-transformer";
import { TransferSucceededDto } from "@app/contracts/transfer-money/dtos/transfer-succeeded.dto";

export interface IFindPeopleParams {
  skip?: number;
  take?: number;
  cursor?: Prisma.PersonWhereUniqueInput;
  where?: Prisma.PersonWhereInput;
  orderBy?: Prisma.PersonOrderByWithRelationInput;
}
export interface IUpdatePersonData {
  where: Prisma.PersonWhereUniqueInput;
  data: Prisma.PersonUpdateInput;
}
export interface ValidatePersonParams {
  tx: Prisma.TransactionClient;
  personId: string;
}

@UseInterceptors(CacheInterceptor)
@Injectable()
export class PeopleService {
  private readonly logger = new Logger(PeopleService.name);
  private readonly salt = this.peopleConfigService.getSalt;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly prismaService: PrismaService,
    private readonly peopleConfigService: PeopleConfigService,
    private readonly cacheConfigService: CacheConfigService,
  ) {}

  @PrismaErrorHandler()
  async createPerson(data: Prisma.PersonCreateInput): Promise<Person> {
    const hashedPassword = await bcrypt.hash(data.password, this.salt);
    return this.prismaService.person.create({
      data: { ...data, password: hashedPassword, roles: [Roles.USER] },
    });
  }

  @PrismaErrorHandler()
  async findPeople(params: IFindPeopleParams): Promise<Person[]> {
    this.logger.log("🔍 Finding people");

    const cacheKey = "people";
    this.logger.log(`Cache key: ${cacheKey}`);

    this.logger.log("🔍 Fetching people from cache");
    const cachedPeople = await this.cacheManager.get<Person[]>(cacheKey);

    if (cachedPeople) {
      this.logger.log("✅ Found people in cache");
      return cachedPeople;
    } else {
      this.logger.log("People not found in cache. Fetching from database");
      const people = this.prismaService.person.findMany(params);

      this.logger.log("🔍 Saving people to cache");
      this.logger.log(`TTL: ${this.cacheConfigService.getTTLWithJitter} miliseconds`);

      this.cacheManager.set(cacheKey, people, this.cacheConfigService.getTTLWithJitter);

      return people;
    }
  }

  @PrismaErrorHandler()
  async findPersonById(where: Prisma.PersonWhereUniqueInput): Promise<Person> {
    this.logger.log(`🔍 Finding person with id: ${where?.id.trim()}`);

    const cacheKey = `person-${where?.id.trim()}`;
    this.logger.log(`Cache key: ${cacheKey}`);

    const cachedPerson = await this.cacheManager.get<Person>(cacheKey);
    this.logger.log(`Cached person: ${JSON.stringify(cachedPerson)}`);

    if (cachedPerson) {
      this.logger.log("✅ Found person in cache");
      return cachedPerson;
    } else {
      try {
        this.logger.log("🔍 Fetching person from database");
        const person = await this.prismaService.person
          .findUniqueOrThrow({ where })
          .catch(() => {
            this.logger.warn(`❌ Person with id ${where.id} not found in the database.`);
            throw new BadRequestException(`Person with id ${where.id} not found.`);
          });
        this.logger.log("✅ Found person in the database");

        this.logger.log("🔍 Saving person to cache");
        this.logger.log(`TTL: ${this.cacheConfigService.getTTLWithJitter} miliseconds`);

        await this.cacheManager.set(
          cacheKey,
          person,
          this.cacheConfigService.getTTLWithJitter,
        );
        this.logger.log(`Cache set`);

        return person;
      } catch (error) {
        this.logger.error(`Error in findPersonByLogin: ${error.message}`);
        throw error;
      }
    }
  }

  @PrismaErrorHandler()
  async findPersonByLogin(where: Prisma.PersonWhereUniqueInput): Promise<Person> {
    this.logger.log(`🔍 Finding person with login: ${where?.login.trim()}`);

    try {
      this.logger.log("🔍 Fetching person from database");
      const person = await this.prismaService.person
        .findUniqueOrThrow({ where })
        .catch(() => {
          this.logger.warn(
            `❌ Person with login ${where.login} not found in the database.`,
          );
          throw new BadRequestException(`Person with login ${where.login} not found.`);
        });
      this.logger.log("✅ Found person in the database");

      return person;
    } catch (error) {
      this.logger.error(`Error in findPersonByLogin: ${error.message}`);
      throw error;
    }
  }

  @PrismaErrorHandler()
  async updatePerson(updatedData: IUpdatePersonData): Promise<Person> {
    const hashedPassword = await bcrypt.hash(
      updatedData.data.password as string,
      this.salt,
    );
    return this.prismaService.person.update({
      where: updatedData.where,
      data: { ...updatedData.data, password: hashedPassword },
    });
  }

  @PrismaErrorHandler()
  async softDeletePerson(where: Prisma.PersonWhereUniqueInput): Promise<Person> {
    return this.prismaService.person.update({
      where,
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }

  @PrismaErrorHandler()
  async deletePerson(where: Prisma.PersonWhereUniqueInput): Promise<Person> {
    return this.prismaService.person.delete({ where });
  }

  @PrismaErrorHandler()
  async transferMoneyFromOneUserToAnother(
    dto: TransferMoneyDto,
  ): Promise<TransferSucceededDto> {
    this.logger.log("🔍 Transferring money");
    const { userIdSendingMoney, userIdReceivingMoney, amountToTransfer } = dto;

    try {
      return await this.prismaService.$transaction(async tx => {
        this.logger.log("🔍 Beginning of transaction transferring money");

        const userSendingMoney: Person = await this.checkUsersExistence(
          userIdSendingMoney,
          userIdReceivingMoney,
          tx,
        );

        await this.checkUserSendingMoneyBalance(userSendingMoney, amountToTransfer);

        const transferResult: boolean = await this.transferMoney(
          userIdSendingMoney,
          userIdReceivingMoney,
          amountToTransfer,
          tx,
        );

        return plainToInstance(TransferSucceededDto, transferResult, {
          excludeExtraneousValues: true,
        });
      });
    } catch (error) {
      this.logger.error(`❌ Failed to transfer money: ${error.message}`);
      throw error;
    }
  }

  private async checkUsersExistence(
    userIdSendingMoney: string,
    userIdReceivingMoney: string,
    tx: Prisma.TransactionClient,
  ): Promise<Person> {
    this.logger.log("🔍 Checking users existence");

    this.logger.log(
      `🔍 Fetching users with IDs: ${userIdSendingMoney} and ${userIdReceivingMoney}`,
    );
    const personSendingMoney = await tx.person.findUniqueOrThrow({
      where: {
        id: userIdSendingMoney,
      },
    });
    this.logger.log(`✅ Found user with ID ${userIdSendingMoney}`);

    await tx.person.findUniqueOrThrow({
      where: {
        id: userIdReceivingMoney,
      },
    });
    this.logger.log(`✅ Found user with ID ${userIdReceivingMoney}`);

    return personSendingMoney;
  }

  private async checkUserSendingMoneyBalance(
    userSendingMoney: Person,
    amountToTransfer: number,
  ): Promise<void> {
    this.logger.log("🔍 Checking user balance");

    if (userSendingMoney.balance.lt(amountToTransfer)) {
      this.logger.error("❌ Person sending money does not have enough money to transfer");
      throw new BadRequestException(
        "The person sending money does not have enough money to transfer",
      );
    }

    this.logger.log("✅ User balance checked successfully");
  }

  private async transferMoney(
    userIdSendingMoney: string,
    userIdReceivingMoney: string,
    amountToTransfer: number,
    tx: Prisma.TransactionClient,
  ): Promise<boolean> {
    this.logger.log("💸 Beginning of transferring money");

    this.logger.log(
      `💸 Decrementing balance of person with ID ${userIdSendingMoney} by ${amountToTransfer}`,
    );
    await tx.person
      .update({
        where: { id: userIdSendingMoney },
        data: { balance: { decrement: amountToTransfer } },
      })
      .catch(error => {
        this.logger.error("❌ Failed to decrement balance of person sending money");
        throw error;
      });
    this.logger.log(
      `💸 Balance of person with ID ${userIdSendingMoney} decremented successfully`,
    );

    this.logger.log(
      `💸 Incrementing balance of person with ID ${userIdReceivingMoney} by ${amountToTransfer}`,
    );
    await tx.person
      .update({
        where: { id: userIdReceivingMoney },
        data: { balance: { increment: amountToTransfer } },
      })
      .catch(error => {
        this.logger.error("❌ Failed to increment balance of person receiving money");
        throw error;
      });
    this.logger.log(
      `💸 Balance of person with ID ${userIdReceivingMoney} incremented successfully`,
    );
    return true;
  }

  async validatePersonBeforePhotoSaving(params: ValidatePersonParams): Promise<void> {
    this.logger.log("🔍 Validating person");
    const { personId, tx } = params;

    const person = await tx.person
      .findUniqueOrThrow({
        where: { id: personId },
      })
      .catch(() => {
        throw new BadRequestException("Person not found");
      });

    if (person.activeAvatars >= 5) {
      this.logger.error("❌ Person already has maximum avatars");
      throw new BadRequestException("Person already has maximum avatars");
    }

    this.logger.log("✅ Person validated successfully");
  }

  async increaseUserActiveAvatarsCount(data: Partial<ISaveAvatarData>): Promise<void> {
    this.logger.log("📈 Beginning of increasing active avatars count");

    const { tx, personId } = data;

    try {
      await tx.person.update({
        where: { id: personId },
        data: { activeAvatars: { increment: 1 } },
      });
      this.logger.log("✅ Active avatars count increased successfully");
    } catch (error) {
      this.logger.error(`❌ Failed to increase active avatars count: ${error.message}`);
      throw error;
    }
  }

  async decreaseUserActiveAvatarsCount(data: Partial<IDeleteAvatarData>): Promise<void> {
    this.logger.log("📉 Beginning of decreasing active avatars count");

    const { tx, personId } = data;

    const person = await tx.person
      .findUniqueOrThrow({
        where: { id: personId },
        select: { activeAvatars: true },
      })
      .catch(() => {
        this.logger.error(`❌ Person with ID ${personId} not found.`);
        throw new Error(`Person with ID ${personId} not found.`);
      });

    if (person.activeAvatars < 0) {
      this.logger.error("❌ Cannot decrease active avatars count below 0.");
      throw new Error("Active avatars count cannot be less than 0.");
    }

    try {
      await tx.person.update({
        where: { id: personId },
        data: { activeAvatars: { decrement: 1 } },
      });
      this.logger.log("✅ Active avatars count decreased successfully");
    } catch (error) {
      this.logger.error(`❌ Failed to decrease active avatars count: ${error.message}`);
      throw error;
    }
  }

  async resetBalanceForEveryone(): Promise<void> {
    this.logger.log("🔄 Beginning of resetting balance for everyone");

    try {
      await this.prismaService.person.updateMany({
        data: { balance: 0.0 },
      });
      this.logger.log("✅ Balance reset for everyone");
    } catch (error) {
      this.logger.error(`❌ Failed to reset balance for everyone: ${error.message}`);
      throw error;
    }
  }
}

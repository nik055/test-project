import { AuthenticationService, ILoginData } from "./authentication.service";
import { PrismaService } from "../prisma-service/prisma-service.service";
import { Test } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { ConfigService } from "@nestjs/config";

describe("AuthenticationService", () => {
  let service: AuthenticationService;
  let configService: ConfigService;

  const mockPrismaService = {
    person: {
      findUniqueOrThrow: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("login", () => {
    const loginData: ILoginData = {
      login: "test",
      password: "password",
    };

    const salt = configService.get<number>("SALT");

    const existingPerson: {
      id: string;
      login: string;
      password: string;
      email: string;
      age: number;
      details: string;
      isDeleted: boolean;
      createdAt: undefined;
      updatedAt: undefined;
      deletedAt: undefined;
    } = {
      id: "1",
      login: loginData.login,
      password: loginData.password,
      email: "1@gmail",
      age: 0,
      details: "123",
      isDeleted: false,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
    };

    const error = new BadRequestException("Invalid password");

    const setUpExistingPerson = async () => {
      mockPrismaService.person.findUniqueOrThrow.mockResolvedValue(existingPerson);
      existingPerson.password = await bcrypt.hash(existingPerson.password, salt);
    };

    it("should return a person", async () => {
      await setUpExistingPerson();

      const result = await service.login(loginData);

      expect(result).toEqual(existingPerson);
    });

    it("should throw an error", async () => {
      await setUpExistingPerson();

      try {
        await service.login({ ...loginData, password: "wrongPassword" });
      } catch (e) {
        expect(e).toEqual(error);
      }
    });
  });
});

import { Test } from "@nestjs/testing";
import { BadRequestException, INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "../app.module";
import * as request from "supertest";
import * as bcrypt from "bcrypt";
import { HttpExceptionFilter } from "../common/filters/http-exception.filter";
import { ValidationError } from "class-validator";
import { $Enums, Roles } from "@prisma/client";

describe("People (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          const messages = validationErrors
            .map(error => Object.values(error.constraints))
            .flat()
            .join(". ");

          return new BadRequestException(messages);
        },
        transform: true,
      }),

      // new ValidationPipe({
      //   exceptionFactory: (validationErrors: ValidationError[] = []) => {
      //     return new BadRequestException(validationErrors);
      //   },
      //   transform: true,
      // }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be defined", () => {
    expect(app).toBeDefined();
  });

  let personId: string = "cm2gjmhrs0000twtq6p9cirl2";
  const newPerson = {
    age: 20,
    details: "12345",
    email: "email@gmail.com",
    login: "login123",
    password: "password123",
  };
  let adminJwtToken: string =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtMmdqbWhzczAwMDF0d3RxNXBkdGJ3MGciLCJyb2xlcyI6WyJBRE1JTiJdLCJpYXQiOjE3MjkzNjYwMzMsImV4cCI6MTcyOTQ1MjQzM30.3c_WtpVW8RzpBY3mnyZlyzRTv0kB487YV9HDRwlQDuQ";
  let userJwtToken: string = "";

  describe("login", () => {
    it("should login as admin", () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({ login: "admin", password: "admin" })
        .expect(201)
        .expect(({ body }) => {
          expect(body.access_token).toBeDefined();
          adminJwtToken = body.access_token;
        });
    });

    it("should login as default user", () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({ login: "test123", password: "test123" })
        .expect(201)
        .expect(({ body }) => {
          expect(body.access_token).toBeDefined();
          userJwtToken = body.access_token;
        });
    });

    it("should fail with invalid login", () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({ login: "admin1", password: "admin" })
        .expect(400)
        .expect(() => {});
    });

    it("should fail with invalid password", () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({ login: "admin", password: "admin1" })
        .expect(400)
        .expect(() => {});
    });
  });

  describe("adminEndpoint", () => {
    it("should return the phrase 'This is an admin only route'", () => {
      return request(app.getHttpServer())
        .get("/people/admin")
        .set("Authorization", `Bearer ${adminJwtToken}`)
        .send()
        .expect(200)
        .expect(({ text }) => {
          expect(text).toEqual("This is an admin only route");
        });
    });

    it("should fail with user token", () => {
      return request(app.getHttpServer())
        .get("/people/admin")
        .set("Authorization", `Bearer ${userJwtToken}`)
        .send()
        .expect(403)
        .expect(() => {});
    });

    it("should fail without token", () => {
      return request(app.getHttpServer())
        .get("/people/admin")
        .send()
        .expect(401)
        .expect(() => {});
    });
  });

  describe("createPerson", () => {
    it("should create a new person", async () => {
      return request(app.getHttpServer())
        .post("/people")
        .send(newPerson)
        .expect(201)
        .expect(({ body }) => {
          expect(body.age).toEqual(newPerson.age);
          expect(body.details).toEqual(newPerson.details);
          expect(body.email).toEqual(newPerson.email);
          expect(body.login).toEqual(newPerson.login);
          expect(bcrypt.compareSync(newPerson.password, body.password)).toBe(true);
          personId = body.id;
        });
    });

    it("should fail if a person with a certain email already exists", async () => {
      const newPersonWithInvalidEmail = JSON.parse(JSON.stringify(newPerson));
      newPersonWithInvalidEmail.login = "login124";

      return request(app.getHttpServer())
        .post("/people")
        .send(newPersonWithInvalidEmail)
        .expect(400)
        .expect(() => {});
    });

    it("should fail if a person with a certain login already exists", async () => {
      const newPersonWithInvalidLogin = JSON.parse(JSON.stringify(newPerson));
      newPersonWithInvalidLogin.email = "email1@gmail.com";

      return request(app.getHttpServer())
        .post("/people")
        .send(newPerson)
        .expect(400)
        .expect(() => {});
    });

    it("should fail because fields values are too small and short", async () => {
      const newPersonWithInvalidData = {
        age: 1,
        details: "1",
        email: "1",
        login: "1",
        password: "1",
      };

      return request(app.getHttpServer())
        .post("/people")
        .send(newPersonWithInvalidData)
        .expect(400)
        .expect(() => {});
    });

    it("should fail because fields values are too big and long", async () => {
      const newPersonWithInvalidData = {
        age: 150,
        details:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
        email:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
        login:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
        password:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
      };

      return request(app.getHttpServer())
        .post("/people")
        .send(newPersonWithInvalidData)
        .expect(400)
        .expect(() => {});
    });
  });

  describe("findPeople", () => {
    it("should fail without token", () => {
      return request(app.getHttpServer())
        .get("/people")
        .send()
        .expect(401)
        .expect(() => {});
    });

    it("should return the list of people", () => {
      return request(app.getHttpServer())
        .get("/people")
        .set("Authorization", `Bearer ${adminJwtToken}`)
        .send()
        .expect(200)
        .expect(({ body }) => {
          expect(body).toBeInstanceOf(Array);
          expect(body.length).toBeGreaterThanOrEqual(3);
        });
    });
  });

  describe("findPersonBy", () => {
    it("should fail without token", () => {
      return request(app.getHttpServer())
        .get(`/people/${personId}`)
        .send()
        .expect(401)
        .expect(() => {});
    });

    it("should return a person with a certain id", () => {
      return request(app.getHttpServer())
        .get(`/people/${personId}`)
        .set("Authorization", `Bearer ${adminJwtToken}`)
        .send()
        .expect(200)
        .expect(({ body }) => {
          expect(body.age).toEqual(newPerson.age);
          expect(body.details).toEqual(newPerson.details);
          expect(body.email).toEqual(newPerson.email);
        });
    });
    it("should fail with invalid id", () => {
      return request(app.getHttpServer())
        .get(`/people/${personId}1`)
        .set("Authorization", `Bearer ${adminJwtToken}`)
        .send()
        .expect(400)
        .expect(() => {});
    });
  });

  describe("aboutMe", () => {
    const admin = {
      age: 20,
      details: "admin",
      email: "admin@gmail.com",
      login: "admin",
      roles: [Roles.ADMIN],
    };

    it("should fail without token", () => {
      return request(app.getHttpServer())
        .get("/people/me")
        .send()
        .expect(401)
        .expect(() => {});
    });

    it("should return a person with a certain token", () => {
      return request(app.getHttpServer())
        .get("/people/me")
        .set("Authorization", `Bearer ${adminJwtToken}`)
        .send()
        .expect(200)
        .expect(({ body }) => {
          expect(body.age).toEqual(admin.age);
          expect(body.details).toEqual(admin.details);
          expect(body.email).toEqual(admin.email);
          expect(body.login).toEqual(admin.login);
        });
    });
  });

  const updatedPerson = {
    age: 50,
    details: "5050505050",
    email: "email50@gmail.com",
    login: "login50",
    password: "password50",
    roles: [$Enums.Roles.ADMIN],
  };

  describe("updatePersonBy", () => {
    it("should fail without token", () => {
      return request(app.getHttpServer())
        .patch(`/people/${personId}`)
        .send(updatedPerson)
        .expect(401)
        .expect(() => {});
    });

    it("should update person", () => {
      return request(app.getHttpServer())
        .patch(`/people/${personId}`)
        .set("Authorization", `Bearer ${adminJwtToken}`)
        .send(updatedPerson)
        .expect(200)
        .expect(({ body }) => {
          expect(body.age).toEqual(updatedPerson.age);
          expect(body.details).toEqual(updatedPerson.details);
          expect(body.email).toEqual(updatedPerson.email);
          expect(body.login).toEqual(updatedPerson.login);
          expect(bcrypt.compareSync(updatedPerson.password, body.password)).toBe(true);
        });
    });

    it("should fail because fields values are too small and short", async () => {
      const newPersonWithInvalidData = {
        age: 1,
        details: "1",
        email: "1",
        login: "1",
        password: "1",
      };

      return request(app.getHttpServer())
        .patch(`/people/${personId}`)
        .set("Authorization", `Bearer ${adminJwtToken}`)
        .send(newPersonWithInvalidData)
        .expect(400)
        .expect(() => {});
    });

    it("should fail because fields values are too big and long", async () => {
      const newPersonWithInvalidData = {
        age: 150,
        details:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
        email:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
        login:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
        password:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
      };

      return request(app.getHttpServer())
        .patch(`/people/${personId}`)
        .set("Authorization", `Bearer ${adminJwtToken}`)
        .send(newPersonWithInvalidData)
        .expect(400)
        .expect(() => {});
    });
  });

  describe("softDeletePersonBy", () => {
    it("should fail without token", () => {
      return request(app.getHttpServer())
        .delete(`/people/soft/${personId}`)
        .send()
        .expect(401)
        .expect(() => {});
    });

    it("should fail with user token", () => {
      return request(app.getHttpServer())
        .delete(`/people/soft/${personId}`)
        .set("Authorization", `Bearer ${userJwtToken}`)
        .send()
        .expect(403)
        .expect(() => {});
    });

    it("should soft delete person", () => {
      return request(app.getHttpServer())
        .delete(`/people/soft/${personId}`)
        .set("Authorization", `Bearer ${adminJwtToken}`)
        .send()
        .expect(200)
        .expect(({ body }) => {
          expect(body.isDeleted).toEqual(true);
          expect(body.deletedAt).toBeDefined();
        });
    });
  });

  describe("deletePersonBy", () => {
    it("should fail without token", () => {
      return request(app.getHttpServer())
        .delete(`/people/${personId}`)
        .send()
        .expect(401)
        .expect(() => {});
    });

    it("should delete person", () => {
      return request(app.getHttpServer())
        .delete(`/people/${personId}`)
        .set("Authorization", `Bearer ${adminJwtToken}`)
        .send()
        .expect(200)
        .expect(({ body }) => {
          expect(body.id).toEqual(personId);
          expect(body.age).toEqual(updatedPerson.age);
          expect(body.details).toEqual(updatedPerson.details);
          expect(body.email).toEqual(updatedPerson.email);
          expect(body.login).toEqual(updatedPerson.login);
          expect(bcrypt.compareSync(updatedPerson.password, body.password)).toBe(true);
        });
    });
  });
});

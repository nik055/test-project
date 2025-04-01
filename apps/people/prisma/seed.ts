import { PrismaClient, Roles } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaModel } from "@people/models";
import Person = PrismaModel.Person;

const prisma = new PrismaClient();
const SALT: number = +process.env.SALT;

const data: Partial<Person>[] = [
  {
    age: 20,
    details: "admin",
    email: "admin@gmail.com",
    login: "admin",
    password: bcrypt.hashSync("admin", SALT),
    roles: [Roles.ADMIN],
    activeAvatars: 0,
    balance: 9999,
  },
  {
    age: 123,
    details: "test123",
    email: "test123@gmail.com",
    login: "test123",
    password: bcrypt.hashSync("test123", SALT),
    roles: [Roles.USER],
    activeAvatars: 0,
    balance: 100,
  },
];

async function main() {
  await data.forEach(async (person: Person) => {
    await prisma.person.create({
      data: person,
    });
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
//

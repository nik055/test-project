import { BadRequestException, Injectable } from "@nestjs/common";
import { Person } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { PeopleService } from "../people/people.service";

export interface ILoginData {
  login: string;
  password: string;
}
export interface IAccessToken {
  access_token: string;
}

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly peopleService: PeopleService,
    private readonly jwtService: JwtService,
  ) {}

  async login(data: ILoginData): Promise<IAccessToken> {
    const person: Person = await this.validatePerson(data);
    const payload = { id: person.id, roles: person.roles };
    const token: string = await this.jwtService.signAsync(payload);
    return { access_token: `Bearer ${token}` };
  }

  async validatePerson(data: ILoginData): Promise<Person> {
    const person: Person = await this.peopleService.findPersonByLogin({
      login: data.login,
    });
    const isMatch: boolean = await bcrypt.compare(data.password, person.password);

    if (isMatch) {
      return person;
    } else {
      throw new BadRequestException("Invalid password");
    }
  }
}

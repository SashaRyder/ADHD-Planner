import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

const HASH_TYPE = 'argon2id';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    if (!await Bun.password.verify(pass, user?.password, HASH_TYPE)) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }

  async register(
    firstName: string,
    lastName: string,
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    try {
      const hashedPass = await Bun.password.hash(pass, HASH_TYPE);
      const user = await this.usersService.create(firstName, lastName, email, hashedPass);
      const payload = { sub: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
      return {
        access_token: await this.jwtService.signAsync(payload)
      };
    }
    catch(error) {
      throw new UnprocessableEntityException(error.code);
    }
  }
}
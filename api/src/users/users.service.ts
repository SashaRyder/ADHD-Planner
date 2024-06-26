import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  findAll = (): Promise<User[]> => {
    return this.usersRepository.find();
  }

  findOne = (email: string): Promise<User | null> => {
    return this.usersRepository.findOneBy({ email });
  }

  create = async (firstName: string, lastName: string, email: string, password: string): Promise<User | null> => {
    const user = await this.usersRepository.insert({ firstName, lastName, email, password });
    return this.findOne(email);
  }

  remove = async (id: number): Promise<void> => {
    await this.usersRepository.delete(id);
  }
}
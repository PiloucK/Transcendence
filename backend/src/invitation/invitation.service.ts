import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Invitation } from './invitation.entity';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly matchRepository: Repository<Invitation>,
    private usersService: UsersService,
  ) {}

  async create(
    user1: User,
    user2Login42: string,
  ) {
    const user2 = await this.usersService.getUserByLogin42(user2Login42);

    const match = this.matchRepository.create({
      user1,
      user2,
    });

    await this.matchRepository.insert(match);

    return match;
  }

  async getForOneUser(userLogin42: string) {
    let matches = await this.matchRepository.find({
      relations: ['user1', 'user2'],
      where: {
        user1: {
          login42: userLogin42,
        },
      },
    });
    matches = matches.concat(
      await this.matchRepository.find({
        relations: ['user1', 'user2'],
        where: {
          user2: {
            login42: userLogin42,
          },
        },
      }),
    );
    return matches;
  }
}

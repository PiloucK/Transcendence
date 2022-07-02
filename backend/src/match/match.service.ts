import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Match } from './match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private usersService: UsersService,
  ) {}

  async create(
    user1: User,
    user2Login42: string,
    user1Points: number,
    user2Points: number,
  ) {
    const user2 = await this.usersService.getUserByLogin42(user2Login42);

    const match = this.matchRepository.create({
      user1,
      user2,
      user1Points,
      user2Points,
    });

    await this.matchRepository.insert(match);

    return match;
  }

  async getForOneUser(userLogin42: string) {
    let matches = await this.matchRepository.find({
      relations: ['userOne', 'userTwo'],
      where: {
        user1: {
          login42: userLogin42,
        },
      },
    });
    matches = matches.concat(
      await this.matchRepository.find({
        relations: ['userOne', 'userTwo'],
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

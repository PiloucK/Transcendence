import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    user1Login42: string,
    user2Login42: string,
    user1Points: number,
    user2Points: number,
    winnerLogin42: string,
  ) {
    const user1 = await this.usersService.getUserByLogin42(user1Login42);
    const user2 = await this.usersService.getUserByLogin42(user2Login42);

    const match = this.matchRepository.create({
      user1,
      user2,
      user1Points,
      user2Points,
      winnerLogin42,
    });

    await this.usersService.updateGameStats(
      user1,
      user2.elo,
      winnerLogin42 !== user2.login42,
    );
    await this.usersService.updateGameStats(
      user2,
      user1.elo,
      winnerLogin42 !== user1.login42,
    );
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

    matches.sort(
      (match1, match2) =>
        match2.createdDate.getTime() - match1.createdDate.getTime(),
    );

    return matches;
  }
}

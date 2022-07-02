import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Match } from './match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async create(
    userOne: User,
    userTwo: User,
    userOnePoints: number,
    userTwoPoints: number,
  ) {
    const match = this.matchRepository.create({
      userOne,
      userTwo,
      userOnePoints,
      userTwoPoints,
    });

    await this.matchRepository.insert(match);

    return match;
  }

  async getForOneUser(userLogin42: string) {
    let matches = await this.matchRepository.find({
      relations: ['userOne', 'userTwo'],
      where: {
        userOne: {
          login42: userLogin42,
        },
      },
    });
    matches = matches.concat(
      await this.matchRepository.find({
        relations: ['userOne', 'userTwo'],
        where: {
          userTwo: {
            login42: userLogin42,
          },
        },
      }),
    );
    return matches;
  }
}

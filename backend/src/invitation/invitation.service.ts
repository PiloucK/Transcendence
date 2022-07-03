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
    private readonly invitationRepository: Repository<Invitation>,
    private usersService: UsersService,
  ) {}

  async create(
    inviter: User,
    user2Login42: string,
  ) {
    const invited = await this.usersService.getUserByLogin42(user2Login42);

    const invitation = this.invitationRepository.create({
      inviter,
      invited,
    });

    await this.invitationRepository.insert(invitation);

    return invitation;
  }

  async getForOneUser(userLogin42: string) {
    let invitations = await this.invitationRepository.find({
      relations: ['inviter', 'invited'],
      where: {
        invited: {
          login42: userLogin42,
        },
      },
    });
    // invitations = invitations.concat(
    //   await this.invitationRepository.find({
    //     relations: ['inviter', 'invited'],
    //     where: {
    //       invited: {
    //         login42: userLogin42,
    //       },
    //     },
    //   }),
    // );
    return invitations;
  }
}

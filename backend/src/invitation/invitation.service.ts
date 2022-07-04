import { 
  ConflictException,
  Injectable
} from '@nestjs/common';
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

	const existingInvitation = await this.invitationRepository.findOne({
		where: {
			invited: {
				login42: invited.login42
			},
			inviter: {
				login42: inviter.login42
			}
		}
	});
    if (existingInvitation) {
		throw new ConflictException('The user is already invited to play.');
	}

    const invitation = this.invitationRepository.create({
      inviter,
      invited,
    });

    await this.invitationRepository.insert(invitation);

    return invitation;
  }

  async delete(
    invited: User,
    inviterLogin42: string,
  ) {
    const inviter = await this.usersService.getUserByLogin42(inviterLogin42);

	const invitation = await this.invitationRepository.findOne({
		where: {
			invited: {
				login42: invited.login42
			},
			inviter: {
				login42: inviter.login42
			}
		}
	});
    if (!invitation) {
		throw new Error('Invitation not found');
	}

    await this.invitationRepository.delete(invitation.id);

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

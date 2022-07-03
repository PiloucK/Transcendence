import { Body, Controller, Get, Param, Post, UseGuards, Delete } from '@nestjs/common';
import { GetReqUser } from 'src/auth/decorators/getReqUser.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { User } from 'src/users/user.entity';
import { CreateInvitationDto, DeclineInvitationDto } from './dto/invitation.dto';
import { InvitationService } from './invitation.service';

@Controller('invitation')
@UseGuards(JwtAuthGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get('/:userLogin42')
  getInvitationsForUser(@Param('userLogin42') userLogin42: string) {
    return this.invitationService.getForOneUser(userLogin42);
  }

  @Delete('/:inviterLogin42')
  declineInvitation(
	@Param('inviterLogin42') inviterLogin42: string,
	@GetReqUser() reqUser: User,
  ) {
    return this.invitationService.delete(
		reqUser,
		inviterLogin42,
	  );
  }

  @Post()
  saveInvitation(
    @Body() createInvitationDto: CreateInvitationDto,
    @GetReqUser() reqUser: User,
  ) {
    const { invitedLogin42 } = createInvitationDto;
    return this.invitationService.create(
      reqUser,
	  invitedLogin42,
    );
  }
}

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetReqUser } from 'src/auth/decorators/getReqUser.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { User } from 'src/users/user.entity';
import { CreateInvitationDto } from './dto/createinvitation.dto';
import { InvitationService } from './invitation.service';

@Controller('invitation')
@UseGuards(JwtAuthGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get('/:userLogin42')
  getInvitationsForUser(@Param('userLogin42') userLogin42: string) {
    return this.invitationService.getForOneUser(userLogin42);
  }

  @Post()
  saveInvitation(
    @Body() createInvitationDto: CreateInvitationDto,
    @GetReqUser() reqUser: User,
  ) {
    const { opponentLogin42 } = createInvitationDto;
    return this.invitationService.create(
      reqUser,
      opponentLogin42,
    );
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { StatusService } from './status.service';

@Controller('user-status')
@UseGuards(JwtAuthGuard)
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  getStatuses() {
    return this.statusService.getStatuses();
  }
}

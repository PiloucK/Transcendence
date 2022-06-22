import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { StatusService } from './status.service';
import { Login42, StatusMetrics } from './status.type';

@Controller('user-status')
@UseGuards(JwtAuthGuard)
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  getStatuses(): Map<Login42, StatusMetrics> {
    return this.statusService.getStatuses();
  }
}

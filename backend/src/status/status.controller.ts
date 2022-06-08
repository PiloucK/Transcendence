import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { StatusDto } from './dto/status.dto';
import { UserStatus } from './status.entity';
import { StatusService } from './status.service';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  addStatus(@Body() statusDto: StatusDto): Promise<UserStatus> {
    return this.statusService.add(statusDto);
  }

  @Delete(':socketid')
  removeStatus(@Param('socketid') socketId: string): Promise<void> {
    return this.statusService.remove(socketId);
  }
}

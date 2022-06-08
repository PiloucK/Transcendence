import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwtAuth.guard';
import { StatusDto } from './dto/status.dto';
import { UserStatus } from './status.entity';
import { StatusService } from './status.service';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  addStatus(@Body() statusDto: StatusDto): Promise<UserStatus> {
    return this.statusService.add(statusDto);
  }

  @Delete(':socketid')
  removeStatus(@Param('socketid') socketId: string): Promise<void> {
    return this.statusService.remove(socketId);
  }
}

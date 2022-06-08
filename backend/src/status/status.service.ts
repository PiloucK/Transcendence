import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { StatusDto } from './dto/status.dto';
import { UserStatus } from './status.entity';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(UserStatus)
    private readonly statusRepository: Repository<UserStatus>,
    private readonly usersService: UsersService,
  ) {}

  async add(statusDto: StatusDto): Promise<UserStatus> {
    const { socketId, userLogin42 } = statusDto;

    const user = await this.usersService.getUserByLogin42(userLogin42);

    let status = await this.statusRepository.findOne(socketId);
    if (!status) {
      status = this.statusRepository.create({
        socketId,
        user,
      });
      await this.statusRepository.save(status);
    }

    return status;
  }

  async remove(socketId: string): Promise<void> {
    await this.statusRepository.delete(socketId);
  }

  // findAll(): Promise<UserStatus[]> {
  //   return this.statusRepository.find();
  // }

  // findOne(id: string): Promise<UserStatus | void> {
  //   return this.statusRepository.findOne(id);
  // }
}

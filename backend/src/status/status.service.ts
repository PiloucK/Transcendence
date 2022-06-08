import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusDto } from './dto/status.dto';
import { UserStatus } from './status.entity';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(UserStatus)
    private readonly statusRepository: Repository<UserStatus>,
  ) {}

  async add(statusDto: StatusDto): Promise<UserStatus> {
    const { socketId } = statusDto;

    const status = this.statusRepository.create({
      socketId,
    });

    await this.statusRepository.save(status);

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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { UserStatus } from './status.entity';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(UserStatus)
    private readonly statusRepository: Repository<UserStatus>,
    private readonly usersService: UsersService,
  ) {}

  async add(socketId: string, userLogin42: string): Promise<UserStatus> {
    let status = await this.statusRepository.findOne(socketId);
    if (!status) {
      const user = await this.usersService.getUserWithStatus(userLogin42);
      status = this.statusRepository.create({
        socketId,
        user,
      });
      await this.statusRepository.save(status);
      console.log('save status');
      if (user.status.length === 0) {
        console.log('online');
        this.usersService.updateOnlineStatus(user.login42, true);
      }
    }

    return status;
  }

  async remove(socketId: string): Promise<void> {
    const status = await this.statusRepository.findOne(socketId, {
      relations: ['user'],
    });
    if (status) {
      const userLogin42 = status.user.login42;
      await this.statusRepository.remove(status);
      console.log('remove status');
      const user = await this.usersService.getUserWithStatus(userLogin42);
      if (user.status.length === 0) {
        console.log('offline');
        this.usersService.updateOnlineStatus(user.login42, false);
      }
    }
  }

  // findAll(): Promise<UserStatus[]> {
  //   return this.statusRepository.find();
  // }

  // findOne(id: string): Promise<UserStatus | void> {
  //   return this.statusRepository.findOne(id);
  // }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStatus } from './status.entity';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(UserStatus)
    private readonly statusRepository: Repository<UserStatus>,
  ) {}
}

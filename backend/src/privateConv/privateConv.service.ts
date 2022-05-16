import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { SendPrivateMessageDto } from './dto/privateConv.dto';
import { PrivateConv } from './privateConv.entity';
import { PrivateConvRepository } from './privateConv.repository';

@Injectable()
export class PrivateConvService {
  constructor(
    @InjectRepository(PrivateConvRepository)
    private readonly privateConvRepository: PrivateConvRepository,
    private readonly usersService: UsersService,
  ) {}

  async createPrivateConv(
    senderLogin42: string,
    receiverLogin42: string,
  ): Promise<PrivateConv> {
    const userOne: User = await this.usersService.getUserByLogin42(
      senderLogin42,
    );
    const userTwo: User = await this.usersService.getUserByLogin42(
      receiverLogin42,
    );

    let privateConv = await this.privateConvRepository.getPrivateConv(
      senderLogin42,
      receiverLogin42,
    );
    if (typeof privateConv !== 'undefined') {
      return privateConv;
    }

    privateConv = this.privateConvRepository.create({
      id: `${userOne.login42}|${userTwo.login42}`,
      userOne,
      userTwo,
      messages: [],
    });

    await this.privateConvRepository.save(privateConv);

    return privateConv;
  }

  async sendPrivateMessage(
    sendPrivateMessageDto: SendPrivateMessageDto,
  ): Promise<PrivateConv> {
    let privateConv = await this.privateConvRepository.getPrivateConv(
      sendPrivateMessageDto.sender,
      sendPrivateMessageDto.receiver,
    );

    if (typeof privateConv === 'undefined') {
      privateConv = await this.createPrivateConv(
        sendPrivateMessageDto.sender,
        sendPrivateMessageDto.receiver,
      );
    }
    privateConv.messages.push(sendPrivateMessageDto.message);

    await this.privateConvRepository.save(privateConv);

    return privateConv;
  }
}

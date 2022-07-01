import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import {
  GetPrivateConvDto,
  GetPrivateConvsDto,
  SendChannelInvitationDto,
  SendPrivateMessageDto,
} from './dto/privateConv.dto';
import { PrivateConv } from './privateConv.entity';

@Injectable()
export class PrivateConvService {
  constructor(
    @InjectRepository(PrivateConv)
    private readonly privateConvRepository: Repository<PrivateConv>,
    private readonly usersService: UsersService,
  ) {}

  async retrievePrivateConv(
    senderLogin42: string,
    receiverLogin42: string,
  ): Promise<PrivateConv | null> {
    let privateConv = await this.privateConvRepository.findOne({
      relations: ['userOne', 'userTwo'],
      where: {
        userOne: {
          login42: senderLogin42,
        },
        userTwo: {
          login42: receiverLogin42,
        },
      },
    });
    if (privateConv !== null) {
      return privateConv;
    }
    privateConv = await this.privateConvRepository.findOne({
      relations: ['userOne', 'userTwo'],
      where: {
        userOne: {
          login42: receiverLogin42,
        },
        userTwo: {
          login42: senderLogin42,
        },
      },
    });
    return privateConv;
  }

  async retrievePrivateConvs(login42: string): Promise<PrivateConv[]> {
    let privateConvs = await this.privateConvRepository.find({
      relations: ['userOne', 'userTwo'],
      where: {
        userOne: {
          login42: login42,
        },
      },
    });
    privateConvs = privateConvs.concat(
      await this.privateConvRepository.find({
        relations: ['userOne', 'userTwo'],
        where: {
          userTwo: {
            login42: login42,
          },
        },
      }),
    );
    return privateConvs;
  }

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

    let privateConv = await this.retrievePrivateConv(
      senderLogin42,
      receiverLogin42,
    );
    if (privateConv !== null) {
      return privateConv;
    }

    privateConv = this.privateConvRepository.create({
      id: `${userOne.login42}|${userTwo.login42}`,
      userOne: userOne,
      userTwo: userTwo,
      messages: [],
    });

    await this.privateConvRepository.save(privateConv);

    return privateConv;
  }

  async sendPrivateMessage(
    sendPrivateMessageDto: SendPrivateMessageDto,
  ): Promise<PrivateConv> {
    let privateConv = await this.retrievePrivateConv(
      sendPrivateMessageDto.sender,
      sendPrivateMessageDto.receiver,
    );

    if (privateConv === null) {
      privateConv = await this.createPrivateConv(
        sendPrivateMessageDto.sender,
        sendPrivateMessageDto.receiver,
      );
    }
    privateConv.messages.push(sendPrivateMessageDto.message);

    await this.privateConvRepository.save(privateConv);

    return privateConv;
  }

  async sendChannelInvite(
    sendChannelInvitationDto: SendChannelInvitationDto,
  ): Promise<PrivateConv> {
    let privateConv = await this.retrievePrivateConv(
      sendChannelInvitationDto.sender,
      sendChannelInvitationDto.receiver,
    );

    if (privateConv === null) {
      privateConv = await this.createPrivateConv(
        sendChannelInvitationDto.sender,
        sendChannelInvitationDto.receiver,
      );
    }
    privateConv.messages.push(sendChannelInvitationDto.invitation);

    await this.privateConvRepository.save(privateConv);

    return privateConv;
  }

  async getPrivateConv(
    getPrivateConvDto: GetPrivateConvDto,
  ): Promise<PrivateConv> {
    const privateConv = await this.retrievePrivateConv(
      getPrivateConvDto.login42,
      getPrivateConvDto.fLogin42,
    );

    if (privateConv === null) {
      throw new Error('Private conversation not found');
    }
    return privateConv;
  }

  async getPrivateConvs(
    getPrivateConvsDto: GetPrivateConvsDto,
  ): Promise<PrivateConv[]> {
    const privateConvs = await this.retrievePrivateConvs(
      getPrivateConvsDto.login42,
    );

    return privateConvs;
  }
}

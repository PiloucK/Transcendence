import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";
import {
  GetPrivateConvDto,
  GetPrivateConvsDto,
  SendPrivateMessageDto,
} from "./dto/privateConv.dto";
import { PrivateConv } from "./privateConv.entity";
import { PrivateConvRepository } from "./privateConv.repository";

@Injectable()
export class PrivateConvService {
  constructor(
    @InjectRepository(PrivateConvRepository)
    private readonly privateConvRepository: PrivateConvRepository,
    private readonly usersService: UsersService
  ) {}

  async createPrivateConv(
    senderLogin42: string,
    receiverLogin42: string
  ): Promise<PrivateConv> {
    const userOne: User = await this.usersService.getUserByLogin42(
      senderLogin42
    );
    const userTwo: User = await this.usersService.getUserByLogin42(
      receiverLogin42
    );

    let privateConv = await this.privateConvRepository.getPrivateConv(
      senderLogin42,
      receiverLogin42
    );
    if (typeof privateConv !== "undefined") {
      return privateConv;
    }

    privateConv = this.privateConvRepository.create({
      id: `${userOne.login42}|${userTwo.login42}`,
      userOne: userOne,
      userTwo: userTwo,
      // Create an empty array of messages that postgres will accept
      messages: [],
    });

    await this.privateConvRepository.save(privateConv);

    return privateConv;
  }

  async sendPrivateMessage(
    sendPrivateMessageDto: SendPrivateMessageDto
  ): Promise<PrivateConv> {
    let privateConv = await this.privateConvRepository.getPrivateConv(
      sendPrivateMessageDto.sender,
      sendPrivateMessageDto.receiver
    );

    if (typeof privateConv === "undefined") {
      privateConv = await this.createPrivateConv(
        sendPrivateMessageDto.sender,
        sendPrivateMessageDto.receiver
      );
    }
    privateConv.messages.push(sendPrivateMessageDto.message);

    await this.privateConvRepository.save(privateConv);

    return privateConv;
  }

  async getPrivateConv(
    getPrivateConvDto: GetPrivateConvDto
  ): Promise<PrivateConv> {
    const privateConv = await this.privateConvRepository.getPrivateConv(
      getPrivateConvDto.login42,
      getPrivateConvDto.fLogin42
    );

    if (typeof privateConv === "undefined") {
      throw new Error("Private conversation not found");
    }
    return privateConv;
  }

  async getPrivateConvs(
    getPrivateConvsDto: GetPrivateConvsDto
  ): Promise<PrivateConv[]> {
    const privateConvs = await this.privateConvRepository.getPrivateConvs(
      getPrivateConvsDto.login42
    );

    return privateConvs;
  }
}

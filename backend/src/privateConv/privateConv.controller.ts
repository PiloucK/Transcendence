import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  GetPrivateConvDto,
  GetPrivateConvsDto,
  SendPrivateMessageDto,
} from './dto/privateConv.dto';
import { PrivateConv } from './privateConv.entity';
import { PrivateConvService } from './privateConv.service';

@Controller('privateConv')
export class PrivateConvController {
  constructor(private privateConvService: PrivateConvService) {}

  @Post('/:senderLogin42/:receiverLogin42')
  createPrivateConv(
    @Param('senderLogin42') senderLogin42: string,
    @Param('receiverLogin42') receiverLogin42: string,
  ): Promise<PrivateConv> {
    return this.privateConvService.createPrivateConv(
      senderLogin42,
      receiverLogin42,
    );
  }

  @Patch('/sendPrivateMessage')
  sendPrivateMessage(
    @Body() sendPrivateMessageDto: SendPrivateMessageDto,
  ): Promise<PrivateConv> {
    return this.privateConvService.sendPrivateMessage(sendPrivateMessageDto);
  }

  @Get('/getPrivateConv')
  getPrivateConv(
    @Body() getPrivateConvDto: GetPrivateConvDto,
  ): Promise<PrivateConv> {
    return this.privateConvService.getPrivateConv(getPrivateConvDto);
  }

  @Get('/getPrivateConvs')
  getPrivateConvs(
    @Body() getPrivateConvsDto: GetPrivateConvsDto,
  ): Promise<PrivateConv[]> {
    return this.privateConvService.getPrivateConvs(getPrivateConvsDto);
  }
}

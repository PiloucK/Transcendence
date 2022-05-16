import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
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
    @Body() sendPrivateMessageDto: sendPrivateMessageDto,
  ): PrivateConv {
    return this.privateConvService.sendPrivateMessage(login42, sendDMDto);
  }

  @Get('/:login42/:fLogin42/getOneDM')
  getOneDM(
    @Param('login42') login42: string,
    @Param('fLogin42') fLogin42: string,
  ): PrivateConv {
    return this.privateConvService.getOneDM(login42, fLogin42);
  }

  @Get('/:login42/getAllOpenedDM')
  getAllOpenedDM(@Param('login42') login42: string): PrivateConv[] {
    return this.privateConvService.getAllOpenedDM(login42);
  }
}

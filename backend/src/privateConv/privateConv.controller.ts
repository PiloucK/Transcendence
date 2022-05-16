import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SendPrivateMessageDto } from './dto/privateConv.dto';
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

  @Get('/:login42/:fLogin42/getPrivateConv')
  getPrivateConv(
    @Param('login42') login42: string,
    @Param('fLogin42') fLogin42: string,
  ): PrivateConv {
    return this.privateConvService.getPrivateConv(login42, fLogin42);
  }

  @Get('/:login42/getPrivateConvs')
  getPrivateConvs(@Param('login42') login42: string): PrivateConv[] {
    return this.privateConvService.getPrivateConvs(login42);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { User } from 'src/users/user.entity';
import { Channel } from './channel.entity';
import { ChannelService } from './channel.service';
import {
  ChannelInfoDto,
  InteractionDto,
  ChannelIdDto,
  JoinProtectedChannelDto,
  RestrictionDto,
  SendMessageDto,
} from './dto/channel.dto';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Post('/:login42/createChannel')
  createChannel(
    @Param('login42') login42: string,
    @Body() createChannelDto: ChannelInfoDto,
  ): Promise<Channel> {
    return this.channelService.createChannel(login42, createChannelDto);
  }

  @Patch('/:login42/updateChannel/:channelId')
  updateChannel(
    @Param('login42') login42: string,
    @Param('channelId') channelId: string,
    @Body() updateChannelDto: ChannelInfoDto,
  ): Promise<Channel> {
    return this.channelService.updateChannel(
      login42,
      channelId,
      updateChannelDto,
    );
  }

  @Patch('/:login42/joinProtectedChannel')
  joinProtectedChannel(
    @Param('login42') login42: string,
    @Body() joinProtectedChannelDto: JoinProtectedChannelDto,
  ): Promise<Channel> {
    return this.channelService.joinProtectedChannel(
      login42,
      joinProtectedChannelDto,
    );
  }

  @Patch('/:login42/joinChannel')
  joinChannel(
    @Param('login42') login42: string,
    @Body() joinChannelDto: ChannelIdDto,
  ): Promise<Channel> {
    return this.channelService.joinChannel(login42, joinChannelDto);
  }

  @Patch('/:login42/inviteToChannel')
  inviteToChannel(
    @Param('login42') login42: string,
    @Body() inviteToChannelDto: InteractionDto,
  ): Promise<Channel> {
    return this.channelService.inviteToChannel(login42, inviteToChannelDto);
  }

  @Patch('/:login42/leaveChannel')
  leaveChannel(
    @Param('login42') login42: string,
    @Body() leaveChannelDto: ChannelIdDto,
  ): Promise<Channel> {
    return this.channelService.leaveChannel(login42, leaveChannelDto);
  }

  @Patch('/:login42/muteAChannelUser')
  muteAChannelUser(
    @Param('login42') login42: string,
    @Body() muteAChannelUserDto: RestrictionDto,
  ): Promise<Channel> {
    return this.channelService.muteAChannelUser(login42, muteAChannelUserDto);
  }

  @Patch('/:login42/banAChannelUser')
  banAChannelUser(
    @Param('login42') login42: string,
    @Body() banAChannelUserDto: RestrictionDto,
  ): Promise<Channel> {
    return this.channelService.banAChannelUser(login42, banAChannelUserDto);
  }

  @Patch('/:login42/setAChannelAdmin')
  setAChannelAdmin(
    @Param('login42') login42: string,
    @Body() setAChannelAdminDto: InteractionDto,
  ): Promise<Channel> {
    return this.channelService.setAChannelAdmin(login42, setAChannelAdminDto);
  }

  @Patch('/:login42/unsetAChannelAdmin')
  unsetAChannelAdmin(
    @Param('login42') login42: string,
    @Body() unsetAChannelAdminDto: InteractionDto,
  ): Promise<Channel> {
    return this.channelService.unsetAChannelAdmin(
      login42,
      unsetAChannelAdminDto,
    );
  }

  @Patch('/:login42/sendMSGToChannel')
  sendMSGToChannel(
    @Param('login42') login42: string,
    @Body() sendMSGToChannelDto: SendMessageDto,
  ): Promise<Channel> {
    return this.channelService.sendMSGToChannel(login42, sendMSGToChannelDto);
  }

  @Get('/:login42/channel/:channelId')
  getChannel(
    @Param('login42') login42: string,
    @Param('channelId') channelId: string,
  ): Promise<Channel> {
    return this.channelService.getChannel(login42, channelId);
  }

  @Post('/:login42/image/:channelId')
  @UseInterceptors(FileInterceptor('file'))
  updateChannelImage(
    @Param('login42') login42: string,
    @Param('channelId') channelId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Channel> {
    return this.channelService.updateChannelImage(login42, channelId, file);
  }

  @Get('/image/:channelId/:imageId')
  getChannelImage(@Param('imageId') imageId: string): StreamableFile {
    const file = createReadStream(
      join(process.cwd(), `/src/uploads/${imageId}`),
    );
    return new StreamableFile(file);
  }

  @Get('/:login42/channel/:channelId/invitableFriends')
  getInvitableFriends(
    @Param('login42') login42: string,
    @Param('channelId') channelId: string,
  ): Promise<User[]> {
    return this.channelService.getInvitableFriends(login42, channelId);
  }

  @Get('/:login42/publicChannels')
  async getPublicChannels(
    @Param('login42') login42: string,
  ): Promise<Channel[]> {
    const channels = await this.channelService.getPublicChannels(login42);
    return channels;
  }

  @Get('/:login42/joinedChannels')
  getJoinedChannels(@Param('login42') login42: string): Promise<Channel[]> {
    return this.channelService.getJoinedChannels(login42);
  }
}

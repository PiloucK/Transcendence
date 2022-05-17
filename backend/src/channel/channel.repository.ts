import { EntityRepository, Repository } from 'typeorm';
import { Channel } from './channel.entity';

@EntityRepository(Channel)
export class ChannelRepository extends Repository<Channel> {
  getChannel(
    senderLogin42: string,
    receiverLogin42: string,
  ): Promise<Channel | undefined> {
    const channel = this.findOne({
      where: {
        id: `${senderLogin42}|${receiverLogin42}`,
      },
    });
    if (typeof channel !== 'undefined') {
      return channel;
    }
    return this.findOne({
      where: {
        id: `${receiverLogin42}|${senderLogin42}`,
      },
    });
  }

  async getChannels(login42: string): Promise<Channel[]> {
    let privateConvs = await this.find({
      where: {
        id: `${login42}|.*`,
      },
    });
    privateConvs = privateConvs.concat(
      await this.find({
        where: {
          id: `.*|${login42}`,
        },
      }),
    );
    return privateConvs;
  }
}

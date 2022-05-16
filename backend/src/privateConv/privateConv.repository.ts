import { EntityRepository, Repository } from 'typeorm';
import { PrivateConv } from './privateConv.entity';

@EntityRepository(PrivateConv)
export class PrivateConvRepository extends Repository<PrivateConv> {
  getPrivateConv(
    senderLogin42: string,
    receiverLogin42: string,
  ): Promise<PrivateConv | undefined> {
    const privateConv = this.findOne({
      where: {
        id: `${senderLogin42}|${receiverLogin42}`,
      },
    });
    if (typeof privateConv !== 'undefined') {
      return privateConv;
    }
    return this.findOne({
      where: {
        id: `${receiverLogin42}|${senderLogin42}`,
      },
    });
  }
}

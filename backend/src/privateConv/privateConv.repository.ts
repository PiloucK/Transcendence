import { EntityRepository, Repository } from 'typeorm';
import { PrivateConv } from './privateConv.entity';

@EntityRepository(PrivateConv)
export class PrivateConvRepository extends Repository<PrivateConv> {
	// Why when this function is call the userOne and userTwo are undefined?
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

  async getPrivateConvs(login42: string): Promise<PrivateConv[]> {
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

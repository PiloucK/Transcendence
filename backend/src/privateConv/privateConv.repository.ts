import { EntityRepository, Repository } from "typeorm";
import { PrivateConv } from "./privateConv.entity";

@EntityRepository(PrivateConv)
export class PrivateConvRepository extends Repository<PrivateConv> {
  getPrivateConv(
    senderLogin42: string,
    receiverLogin42: string
  ): Promise<PrivateConv | undefined> {
    const privateConv = this.findOne({
      relations: ["userOne", "userTwo"],
      where: {
        id: `${senderLogin42}|${receiverLogin42}`,
      },
    });
    if (typeof privateConv !== "undefined") {
      return privateConv;
    }
    return this.findOne({
      relations: ["userOne", "userTwo"],
      where: {
        id: `${receiverLogin42}|${senderLogin42}`,
      },
    });
  }

  async getPrivateConvs(login42: string): Promise<PrivateConv[]> {
    let privateConvs = await this.find({
      relations: ["userOne", "userTwo"],
      where: {
        // id: `${login42}|.*`,
				userOne: {
					login42: login42,
				}
      },
    });
    privateConvs = privateConvs.concat(
      await this.find({
        relations: ["userOne", "userTwo"],
        where: {
          // id: `.*|${login42}`,
					userTwo: {
						login42: login42,
					}
        },
      })
    );
    return privateConvs;
  }
}

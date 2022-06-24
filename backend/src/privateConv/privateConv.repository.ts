import { EntityRepository, Repository } from "typeorm";
import { PrivateConv } from "./privateConv.entity";

@EntityRepository(PrivateConv)
export class PrivateConvRepository extends Repository<PrivateConv> {
  async getPrivateConv(
    senderLogin42: string,
    receiverLogin42: string
  ): Promise<PrivateConv | null> {
    let privateConv = await this.findOne({
      relations: ["userOne", "userTwo"],
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
		privateConv = await this.findOne({
			relations: ["userOne", "userTwo"],
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

  async getPrivateConvs(login42: string): Promise<PrivateConv[]> {
    let privateConvs = await this.find({
      relations: ["userOne", "userTwo"],
      where: {
        userOne: {
          login42: login42,
        },
      },
    });
    privateConvs = privateConvs.concat(
      await this.find({
        relations: ["userOne", "userTwo"],
        where: {
          userTwo: {
            login42: login42,
          },
        },
      })
    );
    return privateConvs;
  }
}

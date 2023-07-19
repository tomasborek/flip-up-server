import { prisma } from "@db/prisma";
import {
  SocialCreateType,
  SocialUpdateType,
} from "@validators/SocialValidator";

const SocialRepository = {
  create: (userId: number, data: SocialCreateType) => {
    return prisma.social.create({ data: { ...data, userId } });
  },
  delete: (id: number) => {
    return prisma.social.delete({ where: { id } });
  },
  update: (id: number, data: SocialUpdateType) => {
    return prisma.social.update({ where: { id }, data });
  },
  findById: (id: number) => {
    return prisma.social.findUnique({ where: { id } });
  },
};
export default SocialRepository;

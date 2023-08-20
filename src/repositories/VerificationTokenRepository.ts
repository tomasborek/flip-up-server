import { prisma } from "@db/prisma";
const VerificationTokenRepository = {
  create: (userId: number) => {
    return prisma.verificationToken.create({
      data: {
        token: `${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
        userId,
      },
    });
  },
  delete: (id: number) => {
    return prisma.verificationToken.delete({
      where: { id },
    });
  },
  findById: (id: number) => {
    return prisma.verificationToken.findUnique({ where: { id } });
  },
  findByToken: (token: string) => {
    return prisma.verificationToken.findUnique({ where: { token } });
  },
  findByUserId: (userId: number) => {
    return prisma.verificationToken.findUnique({ where: { userId } });
  },
};

export default VerificationTokenRepository;

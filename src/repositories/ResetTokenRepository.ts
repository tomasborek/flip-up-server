import { prisma } from "@db/prisma";
const ResetTokenRepository = {
  create: (userId: number) => {
    const token = `${Date.now()}${Math.random().toString(36).substr(2, 5)}`;
    return prisma.resetToken.create({
      data: { userId, token },
    });
  },
  delete: (id: number) => {
    return prisma.resetToken.delete({ where: { id } });
  },
  findByUserId: (userId: number) => {
    return prisma.resetToken.findUnique({ where: { userId } });
  },
  findByToken: (token: string) => {
    return prisma.resetToken.findUnique({
      where: { token },
      include: { user: { select: { id: true, username: true } } },
    });
  },
};

export default ResetTokenRepository;

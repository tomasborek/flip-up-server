import { prisma } from "@db/prisma";

export const readAllMessages = (chatId: number, senderId: number) => {
  return prisma.message.updateMany({
    where: { chatId, userId: senderId },
    data: {
      read: true,
    },
  });
};

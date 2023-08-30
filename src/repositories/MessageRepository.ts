import { prisma } from "@utils/prisma";
import { MessageCreateType } from "@validators/MessageValidator";
const MessageRepository = {
  create: async (userId: number, chatId: number, data: MessageCreateType) => {
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });
    return prisma.message.create({
      data: {
        ...data,
        chatId,
        userId,
      },
    });
  },
  findById: (id: number) => {
    return prisma.message.findUnique({ where: { id } });
  },
  findManyByChatId: (chatId: number) => {
    return prisma.message.findMany({
      where: { chatId },
    });
  },
  addImage: (id: number, fileName: string) => {
    return prisma.message.update({
      where: { id },
      data: { image: `${process.env.ROOT_URL}/uploads/messages/${fileName}` },
    });
  },
};

export default MessageRepository;

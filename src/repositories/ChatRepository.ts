import { prisma } from "@utils/prisma";
import { ChatCreateType } from "@validators/ChatValidator";
const ChatRepository = {
  create: (reqUserId: number, data: ChatCreateType) => {
    return prisma.chat.create({
      data: {
        users: {
          connect: [{ id: reqUserId }, { id: data.recieverId }],
        },
      },
    });
  },
  findById: (id: number, options?: { include: { users: boolean } }) => {
    return prisma.chat.findUnique({
      where: { id },
      include: {
        users: options?.include.users,
      },
    });
  },
  findByUsers: (userIds: number[]) => {
    return prisma.chat.findFirst({
      where: {
        users: {
          every: {
            id: {
              in: userIds,
            },
          },
        },
      },
    });
  },
  getMessages: (
    chatId: number,
    options?: { offset?: number; limit?: number }
  ) => {
    return prisma.message.findMany({
      where: { chatId },
      take: Number(options?.limit) || 20,
      skip: Number(options?.offset) || 0,
      orderBy: { createdAt: "desc" },
      include: {
        referencedListing: {
          select: {
            id: true,
            title: true,
            images: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        listings: {
          select: {
            id: true,
            title: true,
            images: true,
          },
        },
      },
    });
  },
  getUnreadMessages: (chatId: number, reqUserId: number) => {
    return prisma.message.findMany({
      where: { chatId, read: false, userId: { not: reqUserId } },
    });
  },
  readAllMessages: (chatId: number, senderId: number) => {
    return prisma.message.updateMany({
      where: { chatId, userId: senderId },
      data: { read: true },
    });
  },
  isRead: async (chatId: number, reqUserId: number) => {
    const unreadMessages = await ChatRepository.getUnreadMessages(
      chatId,
      reqUserId
    );
    if (Number(unreadMessages?.length) > 0) return false;
    return true;
  },
};

export default ChatRepository;

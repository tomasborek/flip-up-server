import { prisma } from "@db/prisma";

export const isChatRead = async (chatId: number, senderId: number) => {
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        messages: { where: { read: false, userId: senderId } },
      },
    });
    if (Number(chat?.messages.length) > 0) return false;
    return true;
  } catch {
    return true;
  }
};

// GET /chat?userId=1 - #protected
import { prisma } from "@db/prisma";
import type { Request, Response } from "express";
import { isChatRead } from "src/common/services/chat/isChatRead";
import { z } from "zod";
type QueryData = z.infer<typeof getChatsQuerySchema>;

export const getChats = async (req: Request, res: Response) => {
  const query = req.query as QueryData;
  if (query.userId && req.user!.id !== Number(query.userId)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  if (!query.userId && !req.user!.admin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  try {
    const chats = await prisma.chat.findMany({
      where: {
        ...(query.userId
          ? { users: { some: { id: Number(query.userId) } } }
          : {}),
      },
      select: {
        id: true,
        users: {
          where: { id: { not: req.user!.id } },
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        updatedAt: true,
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    const responseChats = await Promise.all(
      chats.map(async (chat) => {
        const otherUser = chat.users[0];
        const read = await isChatRead(chat.id, otherUser.id);
        return {
          id: chat.id,
          user: {
            id: otherUser.id,
            username: otherUser.username,
            avatar: otherUser.avatar,
          },
          isUnread: !read,
          lastMessage: chat.messages[0],
          updatedAt: chat.updatedAt,
        };
      })
    );

    return res.status(200).json({ chats: responseChats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getChatsQuerySchema = z.object({
  userId: z.string().optional(),
});

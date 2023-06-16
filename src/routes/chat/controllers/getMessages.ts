import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";
import { readAllMessages } from "src/common/services/readAllMessages";

type QueryData = z.infer<typeof getMessagesQuerySchema>;

export const getMessages = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const query: QueryData = req.query;
  try {
    const chat = await prisma.chat.findFirst({
      where: { id: Number(chatId) },
      include: {
        users: true,
        messages: {
          take: Number(query.limit) || 20,
          skip: Number(query.offset) || 0,
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
        },
      },
    });
    if (!chat) return res.status(401).send({ message: "Chat not found" });
    if (!chat.users.map((u) => u.id).includes(req.user.id)) {
      //dont allow user to read messages if they are not part of the chat
      return res.status(403).send({ messages: "Forbidden" });
    }
    const senderId = chat.users.find((u) => u.id !== req.user.id)?.id;
    if (!senderId)
      return res.status(500).send({ message: "Internal server error" });
    await readAllMessages(chat.id, senderId);
    return res
      .status(200)
      .send({ messages: chat.messages, offset: Number(query.offset) || 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getMessagesQuerySchema = z.object({
  limit: z.string().optional(),
  offset: z.string().optional(),
});

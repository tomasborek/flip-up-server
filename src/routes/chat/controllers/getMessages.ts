import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";

type QueryData = z.infer<typeof getMessagesQuerySchema>;

export const getMessages = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const query: QueryData = req.query;
  try {
    const chat = await prisma.chat.findFirst({
      where: { id: Number(chatId) },
      include: {
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
              include: { images: true },
            },
          },
        },
        users: true,
      },
    });
    if (!chat) return res.status(401).send({ message: "Chat not found" });
    if (!chat.users.map((u) => u.id).includes(req.user.id)) {
      return res.status(403).send({ messages: "Forbidden" });
    }
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

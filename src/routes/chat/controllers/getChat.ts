import type { Request, Response } from "express";
import { prisma } from "@db/prisma";

export const getChat = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const chat = await prisma.chat.findFirst({
      where: { id: Number(chatId) },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            avatar: true,
            lastActive: true,
          },
        },
      },
    });
    if (!chat?.users.map((u) => u.id).includes(req.user.id)) {
      return res.status(403).send({ message: "Forbidden" });
    }
    const chatWithoutMe = {
      ...chat,
      user: chat.users.filter((user) => user.id !== req.user.id)[0],
    };

    return res.status(200).send({ chat: chatWithoutMe });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

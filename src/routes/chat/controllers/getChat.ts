// GET /chat/:chatId - #protected
import type { Request, Response } from "express";
import { prisma } from "@db/prisma";

export const getChat = async (req: Request, res: Response) => {
  const params = req.params;
  try {
    const chat = await prisma.chat.findFirst({
      where: { id: Number(params.chatId) },
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
    if (!chat?.users.map((u) => u.id).includes(req.user!.id)) {
      return res.status(403).send({ message: "Forbidden" });
    }
    const responseChat = {
      ...chat,
      user: chat.users.filter((user) => user.id !== req.user!.id)[0], //send only the other user
    };

    return res.status(200).send({ chat: responseChat });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

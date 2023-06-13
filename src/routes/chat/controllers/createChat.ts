import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";
import { sendMessage } from "src/common/services/sendMessage";

type Data = z.infer<typeof chatSchema>;

export const createChat = async (req: Request, res: Response) => {
  const body: Data = req.body;
  if (body.recieverId === req.user.id)
    return res
      .status(400)
      .send({ message: "You can't send a message to yourself" });
  try {
    const existingChat = await prisma.chat.findFirst({
      where: {
        users: {
          every: {
            id: {
              in: [req.user.id, body.recieverId],
            },
          },
        },
      },
    });
    if (existingChat) {
      await sendMessage({
        userId: req.user.id,
        chatId: existingChat.id,
        text: body.text,
        listingIds: body.listingIds,
        referencedListingId: body.referencedListingId,
      });
    } else {
      const chat = await prisma.chat.create({
        data: {
          users: {
            connect: [{ id: req.user.id }, { id: body.recieverId }],
          },
        },
      });
      await sendMessage({
        userId: req.user.id,
        chatId: chat.id,
        text: body.text,
        listingIds: body.listingIds,
        referencedListingId: body.referencedListingId,
      });
    }
    return res.status(201).send(null);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const chatSchema = z.object({
  recieverId: z.number(),
  text: z.string().min(1).max(500).trim(),
  listingIds: z.array(z.number().int().positive()).optional(),
  referencedListingId: z.number().int().positive().optional(),
});

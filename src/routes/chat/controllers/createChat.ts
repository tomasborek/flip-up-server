// POST /chat - #protected
import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";
type Data = z.infer<typeof chatSchema>;

export const createChat = async (req: Request, res: Response) => {
  const body: Data = req.body;
  if (body.recieverId === req.user!.id)
    return res
      .status(400)
      .send({ message: "You can't send a message to yourself" });
  try {
    const chat = await prisma.chat.create({
      data: {
        users: { connect: [{ id: req.user!.id }, { id: body.recieverId }] },
      },
    });
    return res.status(201).json({ chat });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const chatSchema = z.object({
  recieverId: z.number(),
});

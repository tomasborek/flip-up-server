// POST /chat/:chatId/message - #protected
import type { Request, Response } from "express";
import { z } from "zod";
import { sendMessage } from "src/common/services/message/sendMessage";
import { prisma } from "@db/prisma";

type Data = z.infer<typeof messageSchema>;

export const createMessage = async (req: Request, res: Response) => {
  const params = req.params;
  const body = req.body as Data;
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: Number(params.chatId) },
      include: { users: true },
    });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    if (!chat.users.map((u) => u.id).includes(req.user!.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const message = await sendMessage({
      userId: req.user!.id,
      chatId: Number(params.chatId),
      text: body.text,
      listingIds: body.listingIds,
      referencedListingId: body.referencedListingId,
    });
    return res.status(201).json({ message });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const messageSchema = z.object({
  text: z.string().min(1).max(500).trim(),
  listingIds: z.array(z.number().int().positive()).optional(),
  referencedListingId: z.number().int().positive().optional(),
});

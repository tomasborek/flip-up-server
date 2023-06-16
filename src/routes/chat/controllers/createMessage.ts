import type { Request, Response } from "express";
import { z } from "zod";
import { sendMessage } from "src/common/services/sendMessage";

type Data = z.infer<typeof messageSchema>;

export const createMessage = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const body = req.body as Data;
  try {
    const message = await sendMessage({
      userId: req.user.id,
      chatId: Number(chatId),
      text: body.text,
      listingIds: body.listingIds,
      referencedListingId: body.referencedListingId,
    });
    return res.status(201).send({ message });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

export const messageSchema = z.object({
  text: z.string().min(1).max(500).trim().optional(),
  listingIds: z.array(z.number().int().positive()).optional(),
  referencedListingId: z.number().int().positive().optional(),
});

import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";

type Data = z.infer<typeof updateSocialSchema>;

export const updateSocial = async (req: Request, res: Response) => {
  const body = req.body as Data;
  try {
    const social = await prisma.social.findUnique({
      where: { id: Number(req.params.socialId) },
    });
    if (!social) return res.status(404).json({ message: "Social not found" });
    if (social.userId !== req.user!.id)
      return res.status(403).json({ message: "Forbidden" });
    await prisma.social.update({
      where: { id: Number(req.params.socialId) },
      data: { url: body.url },
    });
    res.status(200).json(null);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSocialSchema = z.object({
  url: z.string().trim().min(3).max(255).url(),
});

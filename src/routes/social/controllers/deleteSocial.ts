import type { Request, Response } from "express";
import { prisma } from "@db/prisma";

export const deleteSocial = async (req: Request, res: Response) => {
  try {
    const social = await prisma.social.findUnique({
      where: { id: Number(req.params.socialId) },
    });
    if (!social) return res.status(404).json({ message: "Social not found" });
    if (social.userId !== req.user!.id)
      return res.status(403).json({ message: "Forbidden" });
    await prisma.social.delete({ where: { id: Number(req.params.socialId) } });
    res.status(200).json(null);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

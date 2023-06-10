import type { Request, Response } from "express";
import { prisma } from "@db/prisma";

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { socials: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { lastActive: new Date() },
    });
    res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

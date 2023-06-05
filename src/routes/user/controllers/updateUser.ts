import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";

type Data = z.infer<typeof updateUserSchema>;

export const updateUser = async (req: Request, res: Response) => {
  const body: Data = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.userId) },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.id !== req.user!.id)
      return res.status(403).json({ message: "Forbidden" });
    const existingUser = await prisma.user.findUnique({
      where: { username: req.body.username },
    });
    if (existingUser && existingUser.id !== user.id)
      return res.status(409).json({ message: "Username already exists" });
    await prisma.user.update({
      where: { id: Number(req.params.userId) },
      data: {
        ...(req.body.username ? { username: req.body.username } : {}),
        ...(req.body.bio ? { bio: req.body.bio } : {}),
        ...(req.body.lastActive ? { lastActive: req.body.lastActive } : {}),
      },
    });
    res.status(200).json(null);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserSchema = z.object({
  username: z.string().min(3).max(255).trim().optional(),
  bio: z.string().max(255).trim().optional(),
  lastActive: z.date().optional(),
});

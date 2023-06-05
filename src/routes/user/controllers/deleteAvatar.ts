import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import fs from "fs";
export const deleteAvatar = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (req.user.id !== user.id)
      return res.status(403).json({ message: "Forbidden" });
    if (!user.avatar)
      return res.status(404).json({ message: "Avatar not found" });
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { avatar: null },
    });
    res.status(200).json({ message: "Avatar deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
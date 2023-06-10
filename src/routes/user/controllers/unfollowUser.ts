import type { Request, Response } from "express";
import { prisma } from "@db/prisma";

export const unfollowUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.id) },
      include: { following: true },
    });
    const userToUnfollow = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user || !userToUnfollow)
      return res.status(404).json({ message: "User not found" });
    const following = user.following.find((user) => user.id === Number(userId));
    if (!following)
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    await prisma.user.update({
      where: { id: Number(req.user.id) },
      data: { following: { disconnect: { id: Number(userId) } } },
    });
    res.status(200).json(null);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

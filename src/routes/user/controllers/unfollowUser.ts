import type { Request, Response } from "express";
import { prisma } from "@db/prisma";

export const unfollowUser = async (req: Request, res: Response) => {
  const params = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { following: true },
    });
    const userToUnfollow = await prisma.user.findUnique({
      where: { id: Number(params.userId) },
    });
    if (!user || !userToUnfollow)
      return res.status(404).json({ message: "User not found" });
    const following = user.following.find(
      (user) => user.id === Number(params.userId)
    );
    if (!following)
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { following: { disconnect: { id: Number(params.userId) } } },
    });
    res.status(200).json(null);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

import type { Request, Response } from "express";
import { prisma } from "@db/prisma";

export const followUser = async (req: Request, res: Response) => {
  const params = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { following: true },
    });
    const userToFollow = await prisma.user.findUnique({
      where: { id: Number(params.userId) },
    });
    if (!user || !userToFollow)
      return res.status(404).json({ message: "User not found" });
    const alreadyFollowing = user.following.find(
      (user) => user.id === Number(params.userId)
    );
    if (req.user!.id === Number(params.userId))
      return res.status(400).json({ message: "You can't follow yourself" });
    if (alreadyFollowing)
      return res.status(400).json({ message: "Already following this user" });
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { following: { connect: { id: Number(params.userId) } } },
    });
    res.status(200).json(null);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

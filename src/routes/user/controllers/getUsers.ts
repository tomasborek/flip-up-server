import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";

type QueryData = z.infer<typeof getUsersQuerySchema>;
export const getUsers = async (req: Request, res: Response) => {
  const query: QueryData = req.query;
  try {
    const users = await prisma.user.findMany({
      where: {
        ...(query.username ? { username: query.username } : {}),
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        password: false,
        createdAt: true,
        lastActive: true,
        phone: true,
        socials: true,
      },
    });
    res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsersQuerySchema = z.object({
  username: z.string().trim().max(255).optional(),
});

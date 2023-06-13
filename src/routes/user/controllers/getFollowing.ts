import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";

type QueryData = z.infer<typeof getFollowingQuerySchema>;

export const getFollowing = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const query = req.query as QueryData;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        following: {
          orderBy: {
            following: {
              _count: "desc",
            },
          },
          skip:
            query.offset && Number(query.offset) > 0 ? Number(query.offset) : 0,
          select: {
            id: true,
            username: true,
            avatar: true,
            followers: {
              where: {
                id: Number(req.user?.id) || undefined,
              },
            },
          },
        },
      },
    });
    const followingWithAdditionalData = user?.following.map((following) => {
      return {
        id: following.id,
        username: following.username,
        avatar: following.avatar,
        following: following.followers.length > 0,
      };
    });
    return res.status(200).json({
      following: followingWithAdditionalData,
      meta: { offset: query.offset || 0 },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFollowingQuerySchema = z.object({
  offset: z.string().optional(),
});

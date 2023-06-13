import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";

type QueryData = z.infer<typeof getFollowersQuerySchema>;

export const getFollowers = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const query = req.query as QueryData;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        followers: {
          orderBy: {
            followers: {
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
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const followersWithAdditionalInfo = await Promise.all(
      user.followers.map(async (follower) => {
        return {
          id: follower.id,
          username: follower.username,
          avatar: follower.avatar,
          following: follower.followers.length > 0,
        };
      })
    );

    return res.status(200).json({
      followers: followersWithAdditionalInfo,
      meta: { offset: query.offset || 0 },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFollowersQuerySchema = z.object({
  offset: z.string().optional(),
});

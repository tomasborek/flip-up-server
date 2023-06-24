import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";
import { isFollowed } from "src/common/services/user/isFollowed";
import { isFollowing } from "src/common/services/user/isFollowing";
import { getCoreCategory } from "src/common/services/category/getCoreCategory";

type QueryData = z.infer<typeof getUsersQuerySchema>;
export const getUsers = async (req: Request, res: Response) => {
  const query: QueryData = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        ...(query.username ? { username: query.username } : {}),
      },
      take: query.limit ? Number(query.limit) : 10,
      orderBy: {
        ...(query.orderBy === "followers"
          ? {
              followers: {
                _count: "desc",
              },
            }
          : {}),
      },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            listings: true,
            ratings: true,
            interests: true,
          },
        },
        socials: true,
        interests: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const responseUsers = await Promise.all(
      users.map(async (user) => {
        const { password, ...userWithoutPassword } = user;
        return {
          ...userWithoutPassword,
          interests: await Promise.all(
            user.interests.map(async (i) => {
              const core = await getCoreCategory(i.id);
              return {
                ...i,
                coreCategory: core ? core : null,
              };
            })
          ),
          isFollowing: await isFollowing(Number(req.user?.id) || null, user.id),
          isFollowed: await isFollowed(Number(req.user?.id) || null, user.id),
        };
      })
    );

    res.status(200).json({ users: responseUsers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsersQuerySchema = z.object({
  username: z.string().trim().max(255).optional(),
  orderBy: z.enum(["followers"]).optional(),
  limit: z.string().optional(),
});

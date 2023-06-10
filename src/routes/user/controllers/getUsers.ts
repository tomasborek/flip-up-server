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
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            listings: true,
            ratings: true,
          },
        },
        socials: true,
      },
    });

    const usersWithAdditionalData = await Promise.all(
      users.map(async (user) => {
        const { password, ...userWithoutPassword } = user;
        let following;
        let beingFollowed;
        if (req.user) {
          following = await prisma.user.findMany({
            where: {
              id: Number(req.user.id),
              following: {
                some: {
                  id: user.id,
                },
              },
            },
          });
          beingFollowed = await prisma.user.findMany({
            where: {
              id: Number(user.id),
              following: {
                some: {
                  id: req.user.id,
                },
              },
            },
          });
        }

        return {
          ...userWithoutPassword,
          following: following ? (following?.length > 0 ? true : false) : false,
          beingFollowed: beingFollowed
            ? beingFollowed?.length > 0
              ? true
              : false
            : false,
        };
      })
    );

    res.status(200).json({ users: usersWithAdditionalData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsersQuerySchema = z.object({
  username: z.string().trim().max(255).optional(),
});

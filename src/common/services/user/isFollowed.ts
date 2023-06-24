import { prisma } from "@db/prisma";

export const isFollowed = async (
  requestUserId: number | null,
  userId: number
) => {
  if (!requestUserId) return false;
  const users = await prisma.user.findMany({
    where: {
      id: userId,
      following: { some: { id: requestUserId } },
    },
  });

  return users.length > 0;
};

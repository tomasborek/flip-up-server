import { prisma } from "@db/prisma";

export const isFollowing = async (
  requestUserId: number | null,
  userId: number
) => {
  if (!requestUserId) return false;
  const users = await prisma.user.findMany({
    where: {
      id: requestUserId,
      following: { some: { id: userId } },
    },
  });

  return users.length > 0;
};

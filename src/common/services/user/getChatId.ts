import { prisma } from "@db/prisma";

export const getChatId = async (
  requestUserId: number | undefined,
  userId: number
) => {
  if (!requestUserId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      chats: { where: { users: { some: { id: requestUserId } } } },
    },
  });

  return user?.chats[0]?.id;
};

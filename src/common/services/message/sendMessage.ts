import { prisma } from "@db/prisma";
export const sendMessage = async ({
  userId,
  chatId,
  text,
  listingIds,
  referencedListingId,
}: {
  userId: number;
  chatId: number;
  text?: string;
  listingIds?: number[];
  referencedListingId?: number;
}) => {
  await prisma.chat.update({
    where: { id: chatId },
    data: {
      updatedAt: new Date(),
      messages: {
        create: {
          text: text || undefined,
          ...(listingIds && listingIds.length > 0
            ? {
                listings: {
                  connect: listingIds.map((id) => {
                    return {
                      id: Number(id),
                    };
                  }),
                },
              }
            : {}),
          ...(referencedListingId
            ? {
                referencedListing: {
                  connect: {
                    id: referencedListingId,
                  },
                },
              }
            : {}),
          user: {
            connect: {
              id: userId,
            },
          },
        },
      },
    },
  });
  return await prisma.message.findFirst({
    where: { chatId },
    orderBy: { createdAt: "desc" },
  });
};

import { prisma } from "@db/prisma";
export const isLiked = async (
  userId: number | undefined,
  listingId: number
) => {
  if (!userId) return false;
  const likedListing = await prisma.listing.findMany({
    where: {
      id: listingId,
      likedBy: { some: { id: userId } },
    },
  });
  return likedListing.length > 0;
};

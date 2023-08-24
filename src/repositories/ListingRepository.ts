import { prisma } from "@utils/prisma";
import {
  ListingCreateType,
  ListingGetManyType,
  ListingUpdateType,
} from "@validators/ListingValidator";
const ListingRepository = {
  create: (userId: number, data: ListingCreateType) => {
    return prisma.listing.create({ data: { ...data, userId } });
  },
  delete: (listingId: number) => {
    return prisma.listing.delete({ where: { id: listingId } });
  },
  update: (listingId: number, data: ListingUpdateType) => {
    return prisma.listing.update({
      where: { id: listingId },
      data,
    });
  },
  addImage: (listingId: number, url: string) => {
    return prisma.listing.update({
      where: { id: listingId },
      data: { images: { create: { url } } },
    });
  },
  findById: (id: number) => {
    return prisma.listing.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        _count: { select: { likedBy: true } },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            lastActive: true,
            avatar: true,
            _count: { select: { ratings: true } },
          },
        },
      },
    });
  },
  getMany: async (query: ListingGetManyType) => {
    return prisma.listing.findMany({
      take: query.limit ? Number(query.limit) : 20,
      skip: query.offset ? Number(query.offset) : 0,
      orderBy: { createdAt: "desc" },
      where: {
        userId: query.userId ? Number(query.userId) : undefined,
        likedBy: query.likedBy
          ? { some: { id: Number(query.likedBy) } }
          : undefined,
        category: query.category
          ? {
              OR: [
                { id: Number(query.category) },
                { parentCategories: { some: { id: Number(query.category) } } },
              ],
            }
          : undefined,
      },
      include: {
        images: true,
        category: true,
        _count: { select: { likedBy: true } },
      },
    });
  },
  like: async (userId: number, listingId: number) => {
    await prisma.user.update({
      where: { id: userId },
      data: { likedListings: { connect: { id: listingId } } },
    });
  },
  unlike: async (userId: number, listingId: number) => {
    await prisma.user.update({
      where: { id: userId },
      data: { likedListings: { disconnect: { id: listingId } } },
    });
  },
  getFanById: async (userId: number, listingId: number) => {
    return prisma.user.findMany({
      where: {
        id: userId,
        likedListings: { some: { id: listingId } },
      },
    });
  },
  isLiked: async (reqUserId: number | undefined, listingId: number) => {
    if (!reqUserId) return false;
    const fans = await ListingRepository.getFanById(reqUserId, listingId);
    return fans.length > 0;
  },
  isOwned: async (reqUserId: number | undefined, listingId: number) => {
    if (!reqUserId) return false;
    const listing = await ListingRepository.findById(listingId);
    return listing?.userId === reqUserId;
  },
};

export default ListingRepository;

import { prisma } from "@db/prisma";
import { Prisma } from "@prisma/client";
import { UserCreateType, UserUpdateType } from "@validators/UserValidators";
import ChatRepository from "./ChatRepository";

const UserRepository = {
  create: (data: UserCreateType) => {
    return prisma.user.create({ data });
  },
  update: (id: number, data: UserUpdateType) => {
    return prisma.user.update({ where: { id }, data });
  },
  delete: (id: number) => {
    return prisma.user.delete({ where: { id } });
  },
  findByEmail: (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      include: { socials: true },
    });
  },
  findById: (id: number) => {
    return prisma.user.findUnique({
      where: { id },
      include: { socials: true },
    });
  },
  findByUsername: (username: string) => {
    return prisma.user.findUnique({
      where: { username },
      include: { socials: true, interests: true },
    });
  },
  getMany: (options?: {
    limit?: number;
    orderBy?: { followers?: boolean };
    include?: { socials?: boolean; interests: boolean; counts?: boolean };
    query?: {
      username?: string;
      followedByUsername?: string;
      followingUsername?: string;
    };
  }) => {
    return prisma.user.findMany({
      where: {
        username: options?.query?.username || undefined,
        followers: options?.query?.followedByUsername
          ? {
              some: { username: options?.query?.followedByUsername },
            }
          : undefined,
        following: options?.query?.followingUsername
          ? {
              some: { username: options?.query?.followingUsername },
            }
          : undefined,
      },
      take: options?.limit || 20,
      orderBy: options?.orderBy?.followers
        ? { followers: { _count: "desc" } }
        : undefined,
      include: {
        socials: options?.include?.socials || undefined,
        interests: options?.include?.interests || undefined,
        _count: options?.include?.counts
          ? {
              select: {
                listings: true,
                followers: true,
                following: true,
                ratings: true,
                interests: true,
              },
            }
          : undefined,
      },
    });
  },
  updateActivity: (id: number) => {
    return prisma.user.update({
      where: { id },
      data: { lastActive: new Date() },
    });
  },
  connectFollower: (id: number, followerId: number) => {
    return prisma.user.update({
      where: { id },
      data: { followers: { connect: { id: followerId } } },
    });
  },
  disconnectFollower: (id: number, followerId: number) => {
    return prisma.user.update({
      where: { id },
      data: { followers: { disconnect: { id: followerId } } },
    });
  },
  getFollowers: async (
    id: number,
    options?: { limit?: number; offset?: number }
  ) => {
    return prisma.user
      .findUnique({
        where: { id },
      })
      .followers({
        take: options?.limit || undefined,
        skip: options?.offset || undefined,
        select: { id: true, username: true, email: true },
      });
  },
  getFollowerById: async (id: number, followerId: number) => {
    return prisma.user.findMany({
      where: { id, followers: { some: { id: followerId } } },
    });
  },
  getFollowing: async (
    id: number,
    options?: { limit?: number; offset?: number }
  ) => {
    const user = await prisma.user.findUnique({ where: { id } }).following({
      skip: options?.offset || undefined,
      take: options?.limit || undefined,
      select: { id: true, username: true, email: true },
    });
    return user;
  },
  getInterests: (userId: number) => {
    return prisma.category.findMany({
      where: { interestedBy: { some: { id: userId } } },
    });
  },
  connectInterests: (id: number, categoryIds: number[]) => {
    return prisma.user.update({
      where: { id },
      data: { interests: { connect: categoryIds.map((id) => ({ id })) } },
    });
  },
  disconnectInterests: (id: number, categoryIds: number[]) => {
    return prisma.user.update({
      where: { id },
      data: { interests: { disconnect: categoryIds.map((id) => ({ id })) } },
    });
  },
  getChats: (
    id: number,
    options?: {
      include?: { users?: boolean };
      getLastMessage?: boolean;
      orderBy?: "desc" | "asc";
      onlyOtherUser?: boolean;
    }
  ) => {
    return prisma.chat.findMany({
      where: { users: { some: { id } } },
      include: {
        users: options?.include?.users ? true : undefined,
        messages: options?.getLastMessage ? { take: 1 } : undefined,
      },
      orderBy: { updatedAt: options?.orderBy || "desc" },
    });
  },
  amIFollowing: async (userId: number, reqUserId?: number) => {
    if (!reqUserId) return false;
    const users = await UserRepository.getFollowerById(reqUserId, userId);
    return Number(users?.length) > 0;
  },
  amIFollowedBy: async (userId: number, reqUserId: number) => {
    const users = await UserRepository.getFollowerById(userId, reqUserId);
    return Number(users?.length) > 0;
  },
  getChatId: async (reqUserId: number, userId: number) => {
    const chat = await ChatRepository.findByUsers([reqUserId, userId]);
    return chat?.id || null;
  },
};

export default UserRepository;

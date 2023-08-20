import { prisma } from "@db/prisma";
import { Prisma } from "@prisma/client";
import {
  UserCreateType,
  UserGetManyType,
  UserUpdateType,
} from "@validators/UserValidators";
import ChatRepository from "./ChatRepository";
import { RatingCreateType, RatingGetType } from "@validators/RatingValidator";

const UserRepository = {
  create: (data: UserCreateType) => {
    return prisma.user.create({ data });
  },
  update: (id: number, data: UserUpdateType) => {
    return prisma.user.update({ where: { id }, data });
  },
  updatePassword: (id: number, password: string) => {
    return prisma.user.update({ where: { id }, data: { password } });
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
  verify: (userId: number) => {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: { verified: true },
    });
  },
  getMany: (query: UserGetManyType) => {
    return prisma.user.findMany({
      where: {
        username: query?.username || undefined,
        followers: query?.followedByUsername
          ? {
              some: { username: query?.followedByUsername },
            }
          : undefined,
        following: query?.followingUsername
          ? {
              some: { username: query?.followingUsername },
            }
          : undefined,
      },
      take: Number(query.limit) || 20,
      orderBy:
        query.orderBy === "followers"
          ? { followers: { _count: "desc" } }
          : undefined,
      include: {
        socials: true,
        interests: true,
        _count: {
          select: {
            listings: true,
            followers: true,
            following: true,
            ratings: true,
            interests: true,
          },
        },
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
    const users = await UserRepository.getFollowerById(userId, reqUserId);
    return Number(users?.length) > 0;
  },
  amIFollowedBy: async (userId: number, reqUserId: number | undefined) => {
    if (!reqUserId) return false;
    const users = await UserRepository.getFollowerById(reqUserId, userId);
    return Number(users?.length) > 0;
  },
  getChatId: async (reqUserId: number, userId: number) => {
    const chat = await ChatRepository.findByUsers([reqUserId, userId]);
    return chat?.id || null;
  },
  createRating: (authorId: number, userId: number, data: RatingCreateType) => {
    return prisma.rating.create({
      data: {
        rating: data.rating,
        comment: data.comment,
        author: { connect: { id: authorId } },
        user: { connect: { id: userId } },
      },
    });
  },
  getRatings: (userId: number, query: RatingGetType) => {
    return prisma.rating.findMany({
      where: { user: { id: userId } },
      take: query.limit || undefined,
      skip: query.offset || undefined,
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });
  },
  findRatingByAuthorId(userId: number, authorId: number) {
    return prisma.rating.findFirst({
      where: { user: { id: userId }, author: { id: authorId } },
    });
  },
};

export default UserRepository;

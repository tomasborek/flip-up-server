import type { Request, Response } from "express";
import UserRepository from "@repositories/UserRepository";
import { comparePassword, hashPassword } from "@utils/bcrypt";
import { signToken } from "@utils/jwt";
import { response } from "@utils/response";
import SocialRepository from "@repositories/SocialRepository";
import {
  deleteImage,
  isImages,
  nameImage,
  resizeImage,
  writeImage,
} from "@utils/storage";
import path from "path";
import CategoryRepository from "@repositories/CategoryRepository";
import ChatRepository from "@repositories/ChatRepository";

const UserController = {
  login: async (req: Request, res: Response) => {
    const user = await UserRepository.findByEmail(req.body.email);
    if (!user) return response({ res, status: 404, message: "User not found" });
    const isPasswordValid = await comparePassword(
      req.body.password,
      user.password
    );
    if (!isPasswordValid)
      return response({ res, status: 400, message: "Invalid password" });
    const token = signToken({
      id: user.id,
      username: user.username,
      email: user.email,
      admin: user.admin,
    });
    return response({
      res,
      status: 200,
      message: "Successfully logged in",
      data: {
        token,
      },
    });
  },
  create: async (req: Request, res: Response) => {
    const userExists = await UserRepository.findByEmail(req.body.email);
    if (userExists)
      return response({
        res,
        status: 400,
        message: "User with this email already exists",
      });
    const hashedPassword = await hashPassword(req.body.password);
    const user = await UserRepository.create({
      ...req.body,
      password: hashedPassword,
    });
    const token = signToken({
      id: user.id,
      username: user.username,
      email: user.email,
      admin: user.admin,
    });
    return response({
      res,
      status: 201,
      message: "Successfully created user",
      data: { token },
    });
  },
  update: async (req: Request, res: Response) => {
    await UserRepository.update(req.user!.id, req.body);
    return response({
      res,
      status: 200,
      message: "Successfully updated user",
    });
  },
  getMe: async (req: Request, res: Response) => {
    const user = await UserRepository.findById(req.user!.id);
    if (!user) return response({ res, status: 404, message: "User not found" });
    await UserRepository.updateActivity(req.user!.id);
    return response({
      res,
      status: 200,
      message: "Successfully retrieved user",
      data: {
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
          email: user.email,
          admin: user.admin,
          socials: user.socials,
          bio: user.bio,
        },
      },
    });
  },
  getMany: async (req: Request, res: Response) => {
    const users = await UserRepository.getMany({
      limit: Number(req.query.limit) || undefined,
      orderBy: { followers: req.query.orderBy === "followers" || undefined },
      include: { socials: true, interests: true, counts: true },
      query: {
        username: req.query.username as string | undefined,
        followedByUsername:
          (req.query.followedByUsername as string) || undefined,
        followingUsername: (req.query.followingUsername as string) || undefined,
      },
    });
    return response({
      res,
      status: 200,
      message: "Successfully retrieved user",
      data: {
        users: users.map((user) => {
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            admin: user.admin,
            socials: user.socials,
            avatar: user.avatar,
            interests: user.interests,
            _count: user._count,
            following: UserRepository.amIFollowing(user.id, req.user?.id),
            me: Number(req.user?.id) === user.id,
          };
        }),
      },
    });
  },
  addSocial: async (req: Request, res: Response) => {
    const social = await SocialRepository.create(req.user!.id, req.body);
    return response({
      res,
      status: 201,
      message: "Successfully created social",
      data: { social },
    });
  },
  followUser: async (req: Request, res: Response) => {
    const userToFollow = await UserRepository.findById(
      Number(req.params.userId)
    );
    if (!userToFollow)
      return response({ res, status: 404, message: "User not found" });
    await UserRepository.connectFollower(userToFollow.id, req.user!.id);
    return response({
      res,
      status: 200,
      message: "Successfully followed user",
    });
  },
  unfollowUser: async (req: Request, res: Response) => {
    const userToUnfollow = await UserRepository.findById(
      Number(req.params.userId)
    );
    if (!userToUnfollow)
      return response({ res, status: 404, message: "User not found" });
    await UserRepository.disconnectFollower(userToUnfollow.id, req.user!.id);
    return response({
      res,
      status: 200,
      message: "Successfully unfollowed user",
    });
  },
  getFollowers: async (req: Request, res: Response) => {
    const user = await UserRepository.findById(Number(req.params.userId));
    if (!user) return response({ res, status: 404, message: "User not found" });
    const followers = await UserRepository.getFollowers(user.id, {
      offset: Number(req.query.offset),
      limit: Number(req.query.limit),
    });

    return response({
      res,
      status: 200,
      message: "Successfully retrieved followers",
      data: {
        followers: await Promise.all(
          followers!.map(async (f) => {
            return {
              id: f.id,
              username: f.username,
              email: f.email,
              following: await UserRepository.amIFollowing(f.id, req.user!.id),
            };
          })
        ),
      },
    });
  },
  getFollowing: async (req: Request, res: Response) => {
    const user = await UserRepository.findById(Number(req.params.userId));
    if (!user) return response({ res, status: 404, message: "User not found" });
    const followers = await UserRepository.getFollowers(user.id, {
      offset: Number(req.query.offset),
      limit: Number(req.query.limit),
    });
    return response({
      res,
      status: 200,
      message: "Successfully retrieved followers",
      data: {
        followers: await Promise.all(
          followers!.map(async (f) => {
            return {
              id: f.id,
              username: f.username,
              email: f.email,
              following: await UserRepository.amIFollowing(f.id, req.user!.id),
            };
          })
        ),
      },
    });
  },
  addAvatar: async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ message: "No file provided" });
    const validImage = await isImages([req.file]);
    if (!validImage) return res.status(400).json({ message: "Invalid file" });
    const user = await UserRepository.findById(req.user!.id);
    if (!user) return response({ res, status: 404, message: "User not found" });
    if (user.avatar) {
      const fileName = user.avatar.split("/").pop();
      await deleteImage(path.join("uploads", "avatars", fileName!));
    }
    const fileName = nameImage(req.file.originalname);
    const resizedImageBuffer = await resizeImage(req.file.buffer);

    await writeImage({
      path: path.join("uploads", "avatars", fileName),
      buffer: resizedImageBuffer,
    });
    await UserRepository.update(req.user!.id, {
      avatar: `${process.env.ROOT_URL}/uploads/avatars/${fileName}`,
    });
    return response({
      res,
      status: 200,
      message: "Successfully added avatar",
    });
  },
  deleteAvatar: async (req: Request, res: Response) => {
    const user = await UserRepository.findById(req.user!.id);
    if (!user) return response({ res, status: 404, message: "User not found" });
    if (user.avatar) {
      const fileName = user.avatar.split("/").pop();
      await deleteImage(path.join("uploads", "avatars", fileName!));
    }
    await UserRepository.update(req.user!.id, { avatar: null });
    return response({
      res,
      status: 200,
      message: "Successfully deleted avatar",
    });
  },
  updateInterests: async (req: Request, res: Response) => {
    const interests = await UserRepository.getInterests(req.user!.id);
    console.log(interests);
    if (!interests) throw new Error("Internal server error");
    const newInterests = await Promise.all(
      req.body.categoryIds.map(
        async (id: string) => await CategoryRepository.findById(Number(id))
      )
    );
    const categoriesToConnect = newInterests.filter((newInterest) =>
      interests.every((interest) => interest.id !== newInterest!.id)
    );
    console.log(categoriesToConnect);

    const categoriesToDisconnect = interests.filter(
      (interest) => !req.body.categoryIds.includes(interest.id)
    );

    await UserRepository.connectInterests(
      req.user!.id,
      categoriesToConnect.map((c) => c.id)
    );
    await UserRepository.disconnectInterests(
      req.user!.id,
      categoriesToDisconnect.map((c) => c.id)
    );
    return res.status(200).send(null);
  },
  getChats: async (req: Request, res: Response) => {
    const chats = await UserRepository.getChats(req.user!.id, {
      getLastMessage: true,
      orderBy: "desc",
      include: { users: true },
    });

    response({
      res,
      status: 200,
      message: "Successfully retrieved chats",
      data: {
        chats: await Promise.all(
          chats.map(async (c) => {
            const otherUser = c.users.find((u) => u.id !== req.user!.id)!;
            const read = await ChatRepository.isRead(c.id, req.user!.id);
            return {
              id: c.id,
              user: {
                id: otherUser.id,
                username: otherUser.username,
                avatar: otherUser.avatar,
              },
              isUnread: !read,
              lastMessage: c.messages[0],
              updatedAt: c.updatedAt,
            };
          })
        ),
      },
    });
  },
};

export default UserController;

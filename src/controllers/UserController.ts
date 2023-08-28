import type { Request, Response } from "express";
import UserRepository from "@repositories/UserRepository";
import { comparePassword, hashPassword } from "@utils/bcrypt";
import { signToken } from "@utils/jwt";
import { response } from "@utils/response";
import SocialRepository from "@repositories/SocialRepository";
import { render } from "@react-email/render";
import {
  deleteImage,
  isImages,
  nameImage,
  readImage,
  resizeImage,
  writeImage,
} from "@utils/storage";
import path from "path";
import CategoryRepository from "@repositories/CategoryRepository";
import ChatRepository from "@repositories/ChatRepository";
import VerificationTokenRepository from "@repositories/VerificationTokenRepository";
import { sendEmail } from "@utils/email";
import VerificationEmail from "emails/VerificationEmail";
import ResetEmail from "emails/ResetEmail";
import ResetTokenRepository from "@repositories/ResetTokenRepository";

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
    const verification = await VerificationTokenRepository.create(user.id);

    await sendEmail(
      user.email,
      "Ověř svůj e-mail",
      render(VerificationEmail(verification.token))
    );

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
  updatePassword: async (req: Request, res: Response) => {
    await UserRepository.updatePassword(req.user!.id, req.body.password);
    return response({
      res,
      status: 200,
      message: "Password updates succesfully",
    });
  },
  resetPassword: async (req: Request, res: Response) => {
    const resetToken = await ResetTokenRepository.findByToken(req.params.token);
    if (!resetToken) {
      return response({
        res,
        status: 404,
        message: "Token not found",
      });
    }
    const hashedPassword = await hashPassword(req.body.password);
    await UserRepository.updatePassword(resetToken.userId, hashedPassword);
    await ResetTokenRepository.delete(resetToken.id);

    response({
      res,
      status: 200,
      message: "Password reset succesfully",
    });
  },
  sendResetEmail: async (req: Request, res: Response) => {
    const user = await UserRepository.findByEmail(req.params.userEmail);
    if (!user)
      return response({
        res,
        status: 404,
        message: "User not found",
      });
    const existingResetToken = await ResetTokenRepository.findByUserId(user.id);
    if (existingResetToken) {
      await ResetTokenRepository.delete(existingResetToken.id);
    }
    const resetToken = await ResetTokenRepository.create(user.id);
    try {
      await sendEmail(
        user.email,
        "Změna hesla",
        render(ResetEmail(resetToken.token))
      );
    } catch (error) {
      return response({
        res,
        status: 500,
        message: "Internal server error",
      });
    }

    response({
      res,
      status: 200,
      message: "Reset email sent",
    });
  },
  delete: async (req: Request, res: Response) => {
    await UserRepository.delete(req.user!.id);
    response({ res, status: 200, message: "User deleted succesfully" });
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
    const users = await UserRepository.getMany(req.query);
    return response({
      res,
      status: 200,
      message: "Successfully retrieved user",
      data: {
        users: await Promise.all(
          users.map(async (user) => {
            return {
              id: user.id,
              username: user.username,
              email: user.email,
              bio: user.bio,
              admin: user.admin,
              socials: user.socials,
              avatar: user.avatar,
              interests: user.interests,
              lastActive: user.lastActive,
              _count: user._count,
              following: await UserRepository.amIFollowing(
                user.id,
                req.user?.id
              ),
              beingFollowed: await UserRepository.amIFollowedBy(
                user.id,
                req.user?.id
              ),
              me: Number(req.user?.id) === user.id,
            };
          })
        ),
      },
    });
  },
  verifyEmail: async (req: Request, res: Response) => {
    const verification = await VerificationTokenRepository.findByToken(
      req.params.token
    );
    if (!verification)
      return response({ res, status: 404, message: "Verification not found" });
    await UserRepository.verify(verification.userId);
    await VerificationTokenRepository.delete(verification.id);
    return response({
      res,
      status: 200,
      message: "Successfully verified email",
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
      try {
        const file = await readImage(
          path.join("uploads", "avatars", fileName!)
        );
        if (!file) throw new Error("File not found");
        await deleteImage(path.join("uploads", "avatars", fileName!));
      } catch {}
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
    const chats = await UserRepository.getChats(req.user!.id);

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
              lastMessage: {
                id: c.messages[0]?.id,
                text: c.messages[0]?.text,
              },
              updatedAt: c.updatedAt,
            };
          })
        ),
      },
    });
  },
  createRating: async (req: Request, res: Response) => {
    if (req.params.userId === req.user!.id.toString())
      return response({ res, status: 400, message: "You can't rate yourself" });
    const existingRating = await UserRepository.findRatingByAuthorId(
      Number(req.params.userId),
      req.user!.id
    );
    if (existingRating)
      return response({
        res,
        status: 409,
        message: "You have already rated this user",
      });
    await UserRepository.createRating(
      req.user!.id,
      Number(req.params.userId),
      req.body
    );
    return response({
      res,
      status: 200,
      message: "Successfully created rating",
    });
  },
  getRatings: async (req: Request, res: Response) => {
    const ratings = await UserRepository.getRatings(
      Number(req.params.userId),
      req.query
    );
    return response({
      res,
      status: 200,
      message: "Successfully retrieved ratings",
      data: {
        ratings: ratings.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt,
          author: {
            id: r.author.id,
            username: r.author.username,
            avatar: r.author.avatar,
          },
        })),
      },
    });
  },
};

export default UserController;

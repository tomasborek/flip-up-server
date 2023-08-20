import { z } from "zod";

const UserValidator = {
  login: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
  create: z.object({
    email: z.string().email().max(255),
    username: z
      .string()
      .min(3)
      .max(255)
      .regex(/^[a-zA-Z0-9]+$/),
    password: z.string().min(8).max(65),
  }),
  update: z.object({
    bio: z.string().max(255).trim().optional(),
    lastActive: z.date().optional(),
    avatar: z.string().url().max(1000).optional().nullable(),
  }),
  updatePassword: z
    .object({
      password: z.string().max(65).min(8),
    })
    .strict(),
  updateInterests: z
    .object({
      categoryIds: z.array(z.number().int().positive()),
    })
    .strict(),
  getMany: z
    .object({
      username: z.string().min(1).max(255).trim().optional(),
      limit: z.string().optional(),
      orderBy: z.enum(["followers"]).optional(),
      followingUsername: z.string().optional(),
      followedByUsername: z.string().optional(),
    })
    .strict(),
  getFollowers: z.object({
    limit: z.number().int().min(1).max(50),
    offset: z.number().int().positive(),
  }),
  getFollowing: z.object({
    limit: z.number().int().min(1).max(50),
    offset: z.number().int().positive(),
  }),
  resetPassword: z.object({
    password: z.string().min(8).max(65),
  }),
};

export type UserCreateType = z.infer<typeof UserValidator.create>;
export type UserUpdateType = z.infer<typeof UserValidator.update>;
export type UserGetManyType = z.infer<typeof UserValidator.getMany>;

export default UserValidator;

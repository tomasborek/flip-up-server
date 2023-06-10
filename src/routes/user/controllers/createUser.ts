import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@db/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { CurrentUser } from "@interfaces/currentUser";

type Data = z.infer<typeof userSchema>;

export const createUser = async (req: Request, res: Response) => {
  const body: Data = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        password: await bcrypt.hash(body.password, 10),
        lastActive: new Date(),
      },
    });
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        admin: false,
      } as CurrentUser,
      process.env.JWT_SECRET || ""
    );
    res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const userSchema = z.object({
  email: z.string().email().max(255),
  username: z.string().min(3).max(255),
  password: z.string().min(8).max(65),
});

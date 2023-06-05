import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import bcrypt from "bcrypt";
import type { CurrentUser } from "@interfaces/currentUser";
import jwt from "jsonwebtoken";
import { z } from "zod";

type Data = z.infer<typeof authSchema>;

export const auth = async (req: Request, res: Response) => {
  try {
    const body: Data = req.body;
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (!user) return res.status(400).json({ message: "Invalid auth" });
    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid auth" });
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      } as CurrentUser,
      process.env.JWT_SECRET || ""
    );
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() },
    });
    res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

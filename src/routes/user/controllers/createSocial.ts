import type { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";

type Data = z.infer<typeof socialSchema>;

export const createSocial = async (req: Request, res: Response) => {
  try {
    const body: Data = req.body;
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.userId) },
      include: { socials: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (req.user!.id !== user.id)
      return res.status(403).json({ message: "Forbidden" });
    const existingSocial = user.socials.find(
      (social) => social.name === body.name
    );
    if (existingSocial)
      return res.status(409).json({ message: "Social already exists" });

    await prisma.social.create({
      data: {
        name: body.name,
        url: body.url,
        user: { connect: { id: user.id } },
      },
    });
    res.status(201).json(null);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const socialSchema = z.object({
  name: z.union([z.literal("instagram"), z.literal("facebook")]),
  url: z.string().trim().min(3).max(255).url(),
});

import { Request, Response } from "express";
import { prisma } from "@db/prisma";
import { z } from "zod";
type Data = z.infer<typeof updateInterestsSchema>;
export const updateInterests = async (req: Request, res: Response) => {
  const params = req.params;
  const body: Data = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(params.userId) },
      include: { interests: true },
    });
    if (!user) return res.status(404).send({ message: "User not found." });
    const categories = await prisma.category.findMany({
      where: { id: { in: body.categoryIds } },
    });
    const categoriesToConnect = categories.filter(
      (category) =>
        !user.interests.find((interest) => interest.id === category.id)
    );

    const categoriesToDisconnect = user.interests.filter(
      (interest) => !body.categoryIds.includes(interest.id)
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        interests: {
          connect: categoriesToConnect.map((category) => ({ id: category.id })),
          disconnect: categoriesToDisconnect.map((category) => ({
            id: category.id,
          })),
        },
      },
    });
    return res.status(200).send(null);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const updateInterestsSchema = z.object({
  categoryIds: z.array(z.number().int().positive()),
});

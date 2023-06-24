import { prisma } from "@db/prisma";

export const getCoreCategory = async (categoryId: number) => {
  const category = await prisma.category.findMany({
    where: {
      core: true,
      OR: [
        { id: categoryId },
        { subCategories: { some: { id: categoryId } } },
        {
          subCategories: {
            some: { subCategories: { some: { id: categoryId } } },
          },
        },
      ],
    },
    select: {
      id: true,
      title: true,
    },
  });
  return category[0] || null;
};

import { prisma } from "@utils/prisma";
import { CategoryCreateType } from "@validators/CategoryValidator";

const CategoryRepository = {
  create: (data: CategoryCreateType) => {
    return prisma.category.create({
      data: {
        title: data.title,
        core: data.core,
        applicable: data.applicable,
        icon: data.icon,
        parentCategories: data.parentCategoryId
          ? { connect: { id: data.parentCategoryId } }
          : undefined,
      },
    });
  },
  delete: (id: number) => {
    return prisma.category.delete({ where: { id } });
  },
  findById: (id: number, options?: { include: { subcategories: boolean } }) => {
    return prisma.category.findUnique({
      where: { id },
      include: { subCategories: options?.include.subcategories || undefined },
    });
  },
  findMany: (query?: { core?: string }) => {
    return prisma.category.findMany({
      where: { core: query?.core ? true : undefined },
      include: {
        parentCategories: {
          select: { id: true },
        },
        subCategories:
          query?.core !== "only"
            ? {
                include: {
                  subCategories: { include: { subCategories: true } },
                },
              }
            : undefined,
      },
      orderBy: { title: "asc" },
    });
  },
};

export default CategoryRepository;

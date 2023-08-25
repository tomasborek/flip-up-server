import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { categories } from "./categories";
async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        ...category,
        subCategories: {
          create:
            category.subCategories?.map((subCategory) => {
              return {
                ...subCategory,
                subCategories: {
                  create:
                    subCategory.subCategories?.map((subCategory) => {
                      return {
                        ...subCategory,
                      };
                    }) || undefined,
                },
              };
            }) || undefined,
        },
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });

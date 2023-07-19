import { z } from "zod";

const CategoryValidator = {
  create: z
    .object({
      title: z.string().min(1).max(255).trim(),
      applicable: z.boolean(),
      icon: z.string().min(1).max(255).optional(),
      core: z.boolean(),
      parentCategoryId: z.number().int().optional(),
    })
    .strict(),
  getMany: z
    .object({
      core: z.enum(["true", "only"]).optional(),
    })
    .strict(),
};

export type CategoryCreateType = z.infer<typeof CategoryValidator.create>;

export default CategoryValidator;

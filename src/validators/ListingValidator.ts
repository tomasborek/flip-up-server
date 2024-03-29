import { z } from "zod";

const ListingValidator = {
  create: z.object({
    title: z.string().trim().min(1).max(70),
    description: z.string().trim().max(1000).optional(),
    location: z.string().trim().max(255).min(1),
    categoryId: z.number().int().positive().finite(),
  }),
  getMany: z.object({
    category: z.string().optional(),
    userId: z.string().optional(),
    likedBy: z.string().optional(),
    limit: z.string().optional(),
    offset: z.string().optional(),
    byFollowed: z.string().optional(),
    exclude: z.string().optional(),
  }),
  update: z
    .object({
      title: z.string().max(255).trim().min(1).optional(),
      description: z.string().max(1000).min(1).optional(),
      categoryId: z.number().int().positive().finite().optional(),
    })
    .strict(),
};
export type ListingCreateType = z.infer<typeof ListingValidator.create>;
export type ListingGetManyType = z.infer<typeof ListingValidator.getMany>;
export type ListingUpdateType = z.infer<typeof ListingValidator.update>;
export default ListingValidator;

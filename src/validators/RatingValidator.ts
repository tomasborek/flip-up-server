import { z } from "zod";

const RatingValidator = {
  create: z
    .object({
      rating: z.number().int().min(1).max(5),
      comment: z.string().min(1).max(500).trim().optional(),
    })
    .strict(),
  get: z.object({
    offset: z.number().int().positive().optional(),
    limit: z.number().int().positive().optional(),
  }),
};

export type RatingCreateType = z.infer<typeof RatingValidator.create>;
export type RatingGetType = z.infer<typeof RatingValidator.get>;

export default RatingValidator;

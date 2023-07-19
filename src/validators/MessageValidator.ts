import { z } from "zod";

const MessageValidator = {
  create: z
    .object({
      text: z.string().min(1).max(500).trim(),
      listingIds: z.array(z.number().int().positive()).optional(),
      referencedListingId: z.number().int().positive().optional(),
    })
    .strict(),
  get: z
    .object({
      offset: z.string().optional(),
      limit: z.string().optional(),
    })
    .strict(),
};

export type MessageCreateType = z.infer<typeof MessageValidator.create>;

export default MessageValidator;

import { z } from "zod";

const ReportValidator = {
  create: z
    .object({
      type: z.enum(["EXPLICIT", "SPAM", "OTHER"]),
      text: z.string().max(1000).optional(),
      listingId: z.number().int().positive().optional(),
      userId: z.number().int().positive().optional(),
      messageId: z.number().int().positive().optional(),
    })
    .strict(),
  findMany: z
    .object({
      type: z.enum(["EXPLICIT", "SPAM", "OTHER"]).optional(),
      listingId: z.number().int().positive().optional(),
      userId: z.number().int().positive().optional(),
      messageId: z.number().int().positive().optional(),
    })
    .strict(),
};

export type ReportCreateType = z.infer<typeof ReportValidator.create>;
export type ReportFindManyType = z.infer<typeof ReportValidator.findMany>;
export default ReportValidator;

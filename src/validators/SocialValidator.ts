import { z } from "zod";

const SocialValidator = {
  create: z.object({
    type: z.enum(["FACEBOOK", "INSTAGRAM"]),
    url: z.string().trim().min(3).max(255).url(),
  }),
  update: z.object({
    url: z.string().trim().min(3).max(255).url(),
  }),
};

export type SocialCreateType = z.infer<typeof SocialValidator.create>;
export type SocialUpdateType = z.infer<typeof SocialValidator.update>;

export default SocialValidator;

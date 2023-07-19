import { z } from "zod";

const ChatValidator = {
  create: z
    .object({
      recieverId: z.number(),
    })
    .strict(),
};

export type ChatCreateType = z.infer<typeof ChatValidator.create>;
export default ChatValidator;

import { z } from "zod";

const CityValidator = {
  getAll: z
    .object({
      search: z.string().max(255).optional(),
    })
    .strict(),
};

export default CityValidator;

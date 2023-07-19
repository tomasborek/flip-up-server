import SocialRepository from "@repositories/SocialRepository";
import { response } from "@utils/response";
import type { Request, Response } from "express";
const SocialController = {
  delete: async (req: Request, res: Response) => {
    const social = await SocialRepository.findById(Number(req.params.socialId));
    if (!social)
      return response({ res, status: 404, message: "Social not found" });
    if (social.userId !== req.user?.id)
      return response({ res, status: 403, message: "Forbidden" });
    await SocialRepository.delete(Number(req.params.socialId));
    response({
      res,
      status: 200,
      message: "Successfully deleted social",
    });
  },
  update: async (req: Request, res: Response) => {
    const social = await SocialRepository.findById(Number(req.params.socialId));
    if (!social)
      return response({ res, status: 404, message: "Social not found" });
    if (social.userId !== req.user?.id)
      return response({ res, status: 403, message: "Forbidden" });
    await SocialRepository.update(Number(req.params.socialId), req.body);
    response({
      res,
      status: 200,
      message: "Successfully updated social",
    });
  },
};

export default SocialController;

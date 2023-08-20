import ResetTokenRepository from "@repositories/ResetTokenRepository";
import { response } from "@utils/response";

const ResetTokenController = {
  findOne: async (req: any, res: any) => {
    const token = await ResetTokenRepository.findByToken(req.params.token);
    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }
    response({
      res,
      status: 200,
      message: "Token found",
      data: { resetToken: token },
    });
  },
};

export default ResetTokenController;

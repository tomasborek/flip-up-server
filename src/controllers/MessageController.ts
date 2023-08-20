import { Request, Response } from "express";
import { response } from "@utils/response";
import { isImages, nameImage, resizeImage, writeImage } from "@utils/storage";
import MessageRepository from "@repositories/MessageRepository";
import path from "path";
const MessageController = {
  addImage: async (req: Request, res: Response) => {
    if (!req.file) return;
    const validImage = isImages([req.file]);
    if (!validImage) {
      return response({ res, status: 400, message: "Invalid image" });
    }
    const message = await MessageRepository.findById(
      Number(req.params.messageId)
    );
    if (!message)
      return response({ res, status: 404, message: "Message not found" });
    if (message.userId !== req.user!.id)
      return response({ res, status: 403, message: "Forbidden" });
    if (message.image) {
      return response({
        res,
        status: 400,
        message: "Message already has an image",
      });
    }
    const fileName = nameImage(req.file.originalname);

    const resizedImage = await resizeImage(req.file.buffer);
    await writeImage({
      path: path.join("uploads", "messages", fileName),
      buffer: resizedImage,
    });
    await MessageRepository.addImage(message.id, fileName);
    return response({
      res,
      status: 200,
      message: "Image added",
    });
  },
};

export default MessageController;

import { response } from "@utils/response";
import { readImage, readableToBuffer } from "@utils/storage";
import { Request, Response } from "express";
import path from "path";
const UploadController = {
  getListingImage: async (req: Request, res: Response) => {
    const file = await readImage(`listing-images/${req.params.filename}`);
    if (!file.Body)
      return response({
        res,
        status: 404,
        message: "File not found",
      });
    const string = await readableToBuffer(file.Body);
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    res.write(string);
    return res.end();
  },
  getAvatar: async (req: Request, res: Response) => {
    const file = await readImage(`avatars/${req.params.filename}`);
    if (!file.Body)
      return response({
        res,
        status: 404,
        message: "File not found",
      });
    const string = await readableToBuffer(file.Body);
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    res.write(string);
    return res.end();
  },
  getMessageImage: async (req: Request, res: Response) => {
    const file = await readImage(`message-attachments/${req.params.filename}`);
    if (!file.Body)
      return response({
        res,
        status: 404,
        message: "File not found",
      });
    const string = await readableToBuffer(file.Body);
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    res.write(string);
    return res.end();
  },
};

export default UploadController;

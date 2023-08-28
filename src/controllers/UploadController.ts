import { response } from "@utils/response";
import { readImage, readImages } from "@utils/storage";
import { Request, Response } from "express";
import path from "path";
const UploadController = {
  getListingImage: async (req: Request, res: Response) => {
    const file = await readImage(
      path.join("uploads", "listings", req.params.filename)
    );
    if (!file)
      return response({
        res,
        status: 404,
        message: "File not found",
      });
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    return res.end(file);
  },
  getAvatar: async (req: Request, res: Response) => {
    const file = await readImage(
      path.join("uploads", "avatars", req.params.filename)
    );
    if (!file)
      return response({
        res,
        status: 404,
        message: "File not found",
      });
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    return res.end(file);
  },
  getMessageImage: async (req: Request, res: Response) => {
    const file = await readImage(
      path.join("uploads", "messages", req.params.filename)
    );
    if (!file)
      return response({
        res,
        status: 404,
        message: "File not found",
      });
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    return res.end(file);
  },
};

export default UploadController;

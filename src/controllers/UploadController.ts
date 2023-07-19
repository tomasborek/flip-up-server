import { readImage } from "@utils/storage";
import { Request, Response } from "express";
import path from "path";
const UploadController = {
  getListingImage: async (req: Request, res: Response) => {
    const file = await readImage(
      path.join("uploads", "listings", req.params.filename)
    );
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    return res.end(file);
  },
  getAvatar: async (req: Request, res: Response) => {
    const file = await readImage(
      path.join("uploads", "avatars", req.params.filename)
    );
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    return res.end(file);
  },
  getMessageImage: async (req: Request, res: Response) => {
    const file = await readImage(
      path.join("uploads", "messages", req.params.filename)
    );
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    return res.end(file);
  },
};

export default UploadController;

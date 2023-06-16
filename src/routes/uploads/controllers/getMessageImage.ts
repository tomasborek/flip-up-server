import type { Request, Response } from "express";
import fs from "fs";
import path from "path";

export const getMessageImage = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const file = fs.readFileSync(path.join("uploads", "messages", filename));
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    res.end(file);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

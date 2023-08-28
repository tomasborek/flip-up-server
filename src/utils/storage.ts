import fs, { WriteStream } from "fs";
import path from "path";
import { Express } from "express";
import sharp from "sharp";

export const deleteImage = (path: string) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) reject(err);
      resolve(null);
    });
  });
};

export const readImage = (path: string) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, buffer) => {
      if (err) reject(err);
      resolve(buffer);
    });
  });
};

export const readImages = (path: string) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
};

export const writeImage = ({
  path,
  buffer,
}: {
  path: string;
  buffer: Buffer;
}) => {
  const writeStream = fs.createWriteStream(path);
  return new Promise((resolve, reject) => {
    writeStream.write(buffer);
    writeStream.on("error", reject);
    writeStream.on("finish", resolve);
    writeStream.on("end", resolve);
    writeStream.end();
  });
};

export const isImages = (images: Express.Multer.File[]) => {
  const nonImage = images.find((image) => !image.mimetype.startsWith("image"));
  if (nonImage) return false;
  return true;
};

export const nameImage = (originalName: string, id?: number) => {
  let fileName = originalName
    .replace(" ", "-")
    .replace("(", "-")
    .replace(")", "-")
    .replace("/", "-")
    .replace("_", "-")
    .split(".")[0];
  return `${id || ""}${Date.now().toString()}_${fileName.slice(0, 10)}.jpg`;
};

export const resizeImage = (buffer: Buffer) => {
  const resizedImage = sharp(buffer).resize({ width: 500 }).jpeg();
  return resizedImage.toBuffer();
};

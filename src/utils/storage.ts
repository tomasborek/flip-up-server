import fs, { WriteStream } from "fs";
import path from "path";
import { Express } from "express";
import sharp from "sharp";
import { s3client } from "./aws";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export const deleteImage = (key: string) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  };
  return s3client.send(new DeleteObjectCommand(params));
};

export const readImage = (key: string) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  };
  return s3client.send(new GetObjectCommand(params));
};

export const writeImage = ({
  fileName,
  type,
  buffer,
}: {
  fileName: string;
  buffer: Buffer;
  type: "avatars" | "listing-images" | "message-attachments";
}) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `${type}/${fileName}`,
    Body: buffer,
  };
  return s3client.send(new PutObjectCommand(params));
};

export const isImages = (images: Express.Multer.File[]) => {
  const nonImage = images.find((image) => !image.mimetype.startsWith("image"));
  if (nonImage) return false;
  return true;
};

export const nameImage = (
  originalName: string,
  userId: number,
  id?: number
) => {
  //filenames are in the format: <userId>_<id?>_<timestamp>_<filename>.jpg
  let fileName = originalName
    .replace(" ", "-")
    .replace("(", "-")
    .replace(")", "-")
    .replace("/", "-")
    .replace("_", "-")
    .split(".")[0];
  return `${userId}_${id || "0"}_${Date.now().toString()}_${fileName.slice(
    0,
    10
  )}.jpg`;
};

export const resizeImage = (buffer: Buffer) => {
  const resizedImage = sharp(buffer).resize({ width: 500 }).jpeg();
  return resizedImage.toBuffer();
};

export const readableToBuffer = async (readableStream: any) => {
  const chunks: Buffer[] = [];

  for await (const chunk of readableStream) {
    if (Buffer.isBuffer(chunk)) {
      chunks.push(chunk);
    } else {
      throw new Error("Invalid data received from Readable stream");
    }
  }

  return Buffer.concat(chunks);
};

import fs, { WriteStream } from "fs";

export const writeImage = ({
  writeStream,
  buffer,
}: {
  writeStream: WriteStream;
  buffer: Buffer;
}) => {
  return new Promise((resolve, reject) => {
    writeStream.write(buffer);
    writeStream.on("error", reject);
    writeStream.on("end", resolve);
  });
};

import { WriteStream } from "fs";

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
    writeStream.on("finish", resolve);
    writeStream.on("end", resolve);
    writeStream.end();
  });
};

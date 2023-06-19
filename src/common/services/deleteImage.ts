import fs from "fs";

export const deleteImage = (path: string) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) reject(err);
      resolve(null);
    });
  });
};

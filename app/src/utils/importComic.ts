import decompress from "decompress";
import imagemagick from "imagemagick";

import { join, basename, extname } from "path";
import { minioClient } from "./minioClient";
import { mkdirPromise } from "@/utils/mkdirPromise";

import { PrismaClient } from "@prisma/client";

export const genThumbnail = async (
  originalPath: string,
  dstDir: string,
  width: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const filename = basename(originalPath);

    const outPath = join(dstDir, filename);
    imagemagick.resize(
      {
        srcPath: originalPath,
        dstPath: outPath,
        width: width,
      },
      (err: Error, result: any) => {
        if (err) return reject(err);
        resolve(outPath);
      }
    );
  });
};

type importComicByPathParam = {
  savedFilePath: string;
  workDir: string;
  comicId: number;
};
export const importComicByPath = async ({
  savedFilePath,
  workDir,
  comicId,
}: importComicByPathParam) => {
  const prisma = new PrismaClient();

  const originalDir = join(workDir, "original");
  const thumbnailDir = join(workDir, "thumbnail");
  await mkdirPromise(originalDir);
  await mkdirPromise(thumbnailDir);

  const files = await decompress(savedFilePath, originalDir, {
    filter: (file) =>
      (extname(file.path) === ".jpg" || extname(file.path) === ".png") &&
      file.path.indexOf("MACOSX") === -1,
  });

  const pageUrls = await Promise.all(
    files.map(async (file) => {
      const fKey = `comic_pages/${comicId}/${basename(file.path)}`;
      minioClient.fPutObject("k-next", fKey, `${originalDir}/${file.path}`);
      return `http://minio:9000/k-next/${fKey}`;
    })
  );

  const thumbnailFilePaths = await Promise.all(
    files.map(async (file) => {
      console.log({ path: `${originalDir}/${file.path}`, thumbnailDir });
      return await genThumbnail(
        `${originalDir}/${file.path}`,
        thumbnailDir,
        320
      );
    })
  );

  const thumbnailUrls = await Promise.all(
    thumbnailFilePaths.map(async (file) => {
      const fKey = `comic_thumbnails/${comicId}/${basename(file)}`;
      minioClient.fPutObject("k-next", fKey, file);
      return `http://minio:9000/k-next/${fKey}`;
    })
  );

  pageUrls.forEach(async (pageUrl, index) => {
    await prisma.comicPage.create({
      data: {
        comic: { connect: { id: comicId } },
        fileUrl: pageUrl,
        thumbnailUrl: thumbnailUrls[index],
        index: index,
      },
    });
  });
};

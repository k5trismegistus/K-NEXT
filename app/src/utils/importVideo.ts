import fs from "fs";

import { join, basename, extname } from "path";
import { minioClient } from "./minioClient";
import { mkdirPromise, execPromise } from "@/utils/promisified";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type importVideoByPathParam = {
  savedFilePath: string;
  workDir: string;
  videoId: number;
};
import { sprintf } from "sprintf-js";

export const importVideoByPath = async ({
  savedFilePath,
  workDir,
  videoId,
}: importVideoByPathParam) => {
  const thumbnailDir = join(workDir, "thumbnail");
  await mkdirPromise(thumbnailDir);

  const d: string = await execPromise(
    `ffprobe -i "${savedFilePath}" -show_entries format=duration -print_format json  -loglevel quiet`
  );
  const duration = parseInt(JSON.parse(d)["format"]["duration"]);

  await Promise.all(
    Array.from({ length: 10 }, (_, i) => i).map(async (i: number) => {
      await execPromise(
        `ffmpeg -ss ${Math.floor(
          (duration * i) / 10
        )} -t 1 -r 1 -i "${savedFilePath}" -f image2 -s 320x180 ${thumbnailDir}/img_${sprintf(
          "%02d",
          i
        )}.jpg`
      );
    })
  );

  await execPromise(
    `convert -delay 60 -loop 0 ${thumbnailDir}/img_*.jpg ${thumbnailDir}/${videoId}.gif`
  );

  const fKey = `video_thumbnails/${videoId}.gif`;
  minioClient.fPutObject("k-next", fKey, `${thumbnailDir}/${videoId}.gif`);

  await prisma.video.update({
    where: { id: videoId },
    data: {
      thumbnailUrl: `http://minio:9000/k-next/${fKey}`,
    },
  });

  fs.rmdirSync(workDir, { recursive: true });
};

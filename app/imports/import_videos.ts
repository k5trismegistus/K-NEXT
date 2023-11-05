import { minioClient } from "@/utils/minioClient";
import { prisma } from "@/utils/prismaClient";
import { randomUUID } from "crypto";
import { readFile } from "fs/promises";

const importVideos = async () => {
  const configs = await readFile("./imports/videos.json", "utf-8");
  for (const config of JSON.parse(configs)) {
    const uuid = randomUUID();
    const fileKey = `videouploads/${uuid}`;
    minioClient.fPutObject(
      "k-next",
      fileKey,
      `./imports/videos/${config.filename}`,
    );
    const thumbnailKey = `video_thumbnails/${uuid}`;
    minioClient.fPutObject(
      "k-next",
      thumbnailKey,
      `./imports/videos/${config.thumbnail_filename}`,
    );

    const video = await prisma.video.create({
      data: {
        uuid: uuid,
        title: config.filename,
        fileKey,
        thumbnailKey,
        taggable: {
          create: {},
        },
      },
    });

    for (const tagName of config.tags) {
      console.log(tagName);
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: {
          name: tagName,
        },
      });

      const taggable = await prisma.taggable.findFirst({
        where: { id: video.taggableId },
      });

      if (taggable) {
        await prisma.tagging.upsert({
          where: {
            id: taggable.id,
            tagId: tag.id,
          },
          update: {},
          create: {
            tagId: tag.id,
            taggableId: taggable.id,
          },
        });
      }
    }
  }
};

importVideos().then(() => {
  console.log("done");
});

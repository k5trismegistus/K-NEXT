import { minioClient } from "@/utils/minioClient";
import { prisma } from "@/utils/prismaClient";
import { randomUUID } from "crypto";
import { readFile } from "fs/promises";

const importComics = async () => {
  const configs = await readFile("./imports/comics.json", "utf-8");
  for (const config of JSON.parse(configs)) {
    const uuid = randomUUID();

    const comic = await prisma.comic.create({
      data: {
        uuid: uuid,
        title: config.title,
        coverThumbnailKey: "",
        coverKey: "",
        taggable: {
          create: {},
        },
      },
    });

    let firstPageKey;
    let firstThumbnailKey;
    for (const [index, page] of config.pages.entries()) {
      const pageKey = `comic_pages/${uuid}/${page.filename}`;
      const thumbnailKey = `comic_thumbnails/${uuid}/${page.thumbnail_filename}`;

      if (!firstPageKey) {
        firstPageKey = pageKey;
      }
      if (!firstThumbnailKey) {
        firstThumbnailKey = thumbnailKey;
      }

      minioClient.fPutObject(
        "k-next",
        pageKey,
        `./imports/comics/${config.id}/${page.filename}`,
      );
      minioClient.fPutObject(
        "k-next",
        thumbnailKey,
        `./imports/comics/${config.id}/${page.thumbnail_filename}`,
      );

      await prisma.comicPage.create({
        data: {
          comicId: comic.id,
          fileKey: pageKey,
          thumbnailKey: thumbnailKey,
          index,
        },
      });
    }

    await prisma.comic.update({
      where: { id: comic.id },
      data: {
        coverKey: firstPageKey,
        coverThumbnailKey: firstThumbnailKey,
      },
    });

    for (const tagName of config.tags) {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: {
          name: tagName,
        },
      });

      const taggable = await prisma.taggable.findFirst({
        where: { id: comic.taggableId },
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

importComics().then(() => {
  console.log("done");
});

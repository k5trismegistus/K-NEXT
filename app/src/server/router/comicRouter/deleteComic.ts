import { t } from "@/server/trpc";
import { z } from "zod";

import { minioClient } from "@/utils/minioClient";

import { prisma } from "@/utils/prismaClient";
import { ComicWithTagsAndPages } from "@/types";

export const deleteComic = t.procedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    const comic: ComicWithTagsAndPages | null = await prisma.comic.findFirst({
      where: {
        id: input.id,
      },
      include: {
        taggable: {
          include: {
            taggings: {
              include: {
                tag: true,
              },
            },
          },
        },
        comicPages: true,
      },
    });

    if (!comic) {
      return {};
    }

    await Promise.all(
      comic.comicPages.map((page) => {
        minioClient.removeObject("k-next", page.fileKey);
      }),
    );
    await Promise.all(
      comic.comicPages.map((page) => {
        minioClient.removeObject("k-next", page.thumbnailKey);
      }),
    );

    await minioClient.removeObject("k-next", comic.coverKey);
    await minioClient.removeObject("k-next", comic.coverThumbnailKey);

    await prisma.comic.delete({
      where: {
        id: input.id,
      },
    });

    return {};
  });

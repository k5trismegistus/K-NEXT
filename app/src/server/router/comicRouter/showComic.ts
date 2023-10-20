import { t } from "@/server/trpc";
import { z } from "zod";

import { prisma } from "@/utils/prismaClient";
import { ComicWithTagsAndPages } from "@/types";

export const showComic = t.procedure
  .input(z.object({ id: z.number().default(1) }))
  .query(async ({ input }) => {
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

    return { comic };
  });

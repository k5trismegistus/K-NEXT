import { t } from "@/server/trpc";
import { z } from "zod";

import { prisma } from "@/utils/prismaClient";
import { ComicWithTags } from "@/types";

const PER = 12;

export const indexComics = t.procedure
  .input(
    z.object({
      page: z.number().default(1),
      query: z.string().optional(),
      tags: z.array(z.string()).optional(),
    }),
  )
  .query(async ({ input }) => {
    const whereHash: {
      title?: { contains: string };
      id?: { in: number[] };
    } = {};

    if (input.query) {
      whereHash["title"] = { contains: input.query };
    }

    if (input.tags?.length) {
      const comicIds = await input.tags.reduce(
        async (accPromise: Promise<number[]> | null, tag) => {
          const acc = await accPromise;
          if (acc == null) {
            const comicIds = await prisma.comic.findMany({
              select: { id: true },
              where: {
                taggable: {
                  taggings: {
                    some: {
                      tag: {
                        name: tag,
                      },
                    },
                  },
                },
              },
            });
            return comicIds.map((project) => project.id);
          } else if (acc.length === 0) {
            return [];
          } else {
            const comicIds = await prisma.comic.findMany({
              select: { id: true },
              where: {
                AND: [
                  { id: { in: acc } },
                  {
                    taggable: {
                      taggings: {
                        some: {
                          tag: {
                            name: tag,
                          },
                        },
                      },
                    },
                  },
                ],
              },
            });
            return comicIds.map((project) => project.id);
          }
        },
        null,
      );

      whereHash["id"] = { in: comicIds ?? [] };
    }

    const comics: ComicWithTags[] = await prisma.comic.findMany({
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
      },
      skip: (input.page - 1) * PER,
      take: 12,
      where: whereHash,
    });
    const totalComics = await prisma.comic.count({
      where: whereHash,
    });

    return { comics, totalPages: Math.ceil(totalComics / PER) };
  });

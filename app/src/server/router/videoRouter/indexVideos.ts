import { t } from "@/server/trpc";
import { z } from "zod";

import { prisma } from "@/utils/prismaClient";

const PER = 12;

export const indexVideos = t.procedure
  .input(
    z.object({
      page: z.number().default(1),
      query: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
  )
  .query(async ({ input }) => {
    const queryHash: { include: any; skip: number; take: number; where?: any } =
      {
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
      };

    if (input.query) {
      queryHash["where"] = {
        title: { contains: input.query },
      };
    }

    if (input.tags?.length) {
      const projectIds = await input.tags.reduce(
        async (accPromise: Promise<number[]> | null, tag) => {
          const acc = await accPromise;
          if (acc == null) {
            const projectIds = await prisma.video.findMany({
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
            return projectIds.map((project) => project.id);
          } else {
            const projectIds = await prisma.video.findMany({
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
            return projectIds.map((project) => project.id);
          }
        },
        null
      );

      queryHash["where"] = { id: { in: projectIds } };
    }

    const videos = await prisma.video.findMany(queryHash);
    const totalVideos = await prisma.video.count();

    return { videos, totalPages: Math.ceil(totalVideos / PER) };
  });

import { t } from "@/server/trpc";
import { z } from "zod";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PER = 12;

export const indexVideos = t.procedure
  .input(
    z.object({ page: z.number().default(1), query: z.string().optional() })
  )
  .query(async ({ input }) => {
    const videos = await prisma.video.findMany({
      where: {
        title: {
          contains: input.query,
        },
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
      },
      skip: (input.page - 1) * PER,
      take: 12,
    });

    return { videos, totalPages: Math.ceil(videos.length / PER) };
  });

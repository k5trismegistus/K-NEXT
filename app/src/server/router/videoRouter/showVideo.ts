import { t } from "@/server/trpc";
import { z } from "zod";

import { Video } from "@prisma/client";

import { prisma } from "@/utils/prismaClient";

export const showVideo = t.procedure
  .input(z.object({ id: z.number().default(1) }))
  .query(async ({ input }) => {
    const video: Video | null = await prisma.video.findFirst({
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
      },
    });

    return { video };
  });

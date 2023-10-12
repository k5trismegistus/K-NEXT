import { t } from "@/server/trpc";
import { z } from "zod";

import { PrismaClient, Video } from "@prisma/client";

const prisma = new PrismaClient();

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

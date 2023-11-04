import { randomUUID } from "crypto";
import { z } from "zod";
import { t } from "@/server/trpc";

import { minioClient } from "@/utils/minioClient";

import { prisma } from "@/utils/prismaClient";
import { VideoWithTags } from "@/types";

export const deleteVideo = t.procedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    const id = { id: input.id };

    const video = await prisma.video.findFirst({
      where: {
        id: input.id,
      },
    });

    if (!video) {
      return {};
    }

    const videoFileKey = video.fileKey;
    const videoThumbnailKey = video.thumbnailKey;

    minioClient.removeObject("k-next", videoFileKey);
    minioClient.removeObject("k-next", videoFileKey);

    return {};
  });

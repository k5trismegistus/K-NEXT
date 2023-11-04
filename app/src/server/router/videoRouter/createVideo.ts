import { randomUUID } from "crypto";
import { z } from "zod";
import { t } from "@/server/trpc";

import { minioClient } from "@/utils/minioClient";

import { prisma } from "@/utils/prismaClient";

export const createVideo = t.procedure
  .input(z.object({ key: z.string() }))
  .mutation(async ({ input }) => {
    const presignedKey = await minioClient.presignedPutObject(
      "k-next",
      input.key,
      60 * 60 * 24 * 7,
    );

    const filename = input.key.split("/").pop();

    const video = await prisma.video.create({
      data: {
        uuid: randomUUID(),
        title: filename!,
        fileKey: `/k-next/${input.key}`,
        thumbnailKey: "",
        taggable: {
          create: {},
        },
      },
    });

    return { presignedKey, video };
  });

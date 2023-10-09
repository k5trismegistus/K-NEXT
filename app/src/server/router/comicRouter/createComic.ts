import { randomUUID } from "crypto";
import { z } from "zod";
import { t } from "@/server/trpc";
import { PrismaClient } from "@prisma/client";

import { minioClient } from "@/utils/minioClient";

const prisma = new PrismaClient();

export const createComic = t.procedure
  .input(z.object({ key: z.string() }))
  .mutation(async ({ input }) => {
    const presignedUrl = await minioClient.presignedPutObject(
      "k-next",
      input.key,
      60 * 60 * 24 * 7
    );

    const filename = input.key.split("/").pop();

    const comic = await prisma.comic.create({
      data: {
        uuid: randomUUID(),
        title: filename!,
        coverThumbnailUrl: "",
        coverUrl: "",
        taggable: {
          create: {},
        },
      },
    });

    return { presignedUrl, comic };
  });

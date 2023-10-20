import { z } from "zod";
import { t } from "@/server/trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const indexTags = t.procedure
  .input(z.object({ type: z.union([z.literal("video"), z.literal("comic")]) }))
  .query(async ({ input }) => {
    const taggables = await prisma.taggable.findMany({
      where: {
        [input.type]: {
          is: {},
        },
      },
    });
    const taggings = await prisma.tagging.findMany({
      where: {
        taggableId: {
          in: taggables.map((taggable) => taggable.id),
        },
      },
    });
    const tags = await prisma.tag.findMany({
      where: {
        id: {
          in: taggings.map((tagging) => tagging.tagId),
        },
      },
    });

    return { tags };
  });

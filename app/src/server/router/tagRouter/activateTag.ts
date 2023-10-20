import { z } from "zod";
import { t } from "@/server/trpc";
import { prisma } from "@/utils/prismaClient";
import { Taggable } from "@prisma/client";

const findTaggable = async (input: {
  type: string;
  id: number;
}): Promise<Taggable | null> => {
  if (input.type === "video") {
    const video = await prisma.video.findFirst({
      where: { id: input.id },
    });
    const taggableId = video?.taggableId;
    const taggable = await prisma.taggable.findFirst({
      where: { id: taggableId },
    });
    return taggable;
  } else if (input.type === "comic") {
    const comic = await prisma.comic.findFirst({
      where: { id: input.id },
    });
    const taggableId = comic?.taggableId;
    const taggable = await prisma.taggable.findFirst({
      where: { id: taggableId },
    });
    return taggable;
  }
  return null;
};

export const activateTag = t.procedure
  .input(
    z.object({
      tagNames: z.array(z.string()),
      type: z.union([z.literal("video"), z.literal("comic")]),
      id: z.number(),
    }),
  )
  .mutation(async ({ input }) => {
    const tags = await Promise.all(
      input.tagNames.map(async (tagName) => {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: {
            name: tagName,
          },
        });

        const taggable = await findTaggable(input);

        if (taggable) {
          await prisma.tagging.upsert({
            where: {
              id: taggable.id,
              tagId: tag.id,
            },
            update: {},
            create: {
              tagId: tag.id,
              taggableId: taggable.id,
            },
          });
        }

        return tag;
      }),
    );

    return { tags };
  });

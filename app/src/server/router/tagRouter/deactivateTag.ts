import { z } from "zod";
import { t } from "@/server/trpc";
import { prisma } from "@/utils/prismaClient";

export const deactivateTag = t.procedure
  .input(z.object({ taggingId: z.number() }))
  .mutation(async ({ input }) => {
    const tag = await prisma.tag.delete({
      where: { id: input.taggingId },
    });

    return {};
  });

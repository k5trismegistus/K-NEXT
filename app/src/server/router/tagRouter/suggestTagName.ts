import { z } from "zod";
import { t } from "@/server/trpc";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const suggestTagName = t.procedure
  .input(z.object({ fragment: z.string() }))
  .query(async ({ input }) => {
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: input.fragment,
          mode: "insensitive",
        },
      },
    });

    return { tagNames: tags.map((tag) => tag.name) };
  });

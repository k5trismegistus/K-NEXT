import { t } from "@/server/trpc";
import { z } from "zod";

import { prisma } from "@/utils/prismaClient";

const PER = 12;

export const indexComics = t.procedure
  .input(
    z.object({ page: z.number().default(1), query: z.string().optional() })
  )
  .query(async ({ input }) => {
    const comics = await prisma.comic.findMany({
      where: {
        title: {
          contains: input.query,
        },
      },
      include: {
        comicPages: true,
      },
      skip: (input.page - 1) * PER,
      take: 12,
    });

    return { comics, totalPages: Math.ceil(comics.length / PER) };
  });

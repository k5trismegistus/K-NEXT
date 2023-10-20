import { join, basename, extname } from "path";

import { z } from "zod";
import { t } from "@/server/trpc";

import { mkdirPromise } from "@/utils/promisified";
import { minioClient } from "@/utils/minioClient";
import { importComicByPath } from "@/utils/importComic";

export const completeUploadComic = t.procedure
  .input(z.object({ id: z.number(), key: z.string() }))
  .mutation(async ({ input }) => {
    const workDir = join("/tmp/comics", input.id.toString());
    await mkdirPromise(workDir);

    const filename = input.key.split("/").pop();

    const savedFilePath = join(workDir, filename!);

    const resp = await minioClient.fGetObject(
      "k-next",
      input.key,
      savedFilePath,
    );

    await importComicByPath({ savedFilePath, workDir, comicId: input.id });

    await minioClient.removeObject("k-next", input.key);

    return {};
  });

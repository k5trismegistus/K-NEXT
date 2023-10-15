import { t } from "@/server/trpc";

import { comicRouter } from "@/server/router/comicRouter";
import { videoRouter } from "@/server/router/videoRouter";
import { tagRouter } from "./tagRouter";

export const appRouter = t.router({
  ...comicRouter,
  ...videoRouter,
  ...tagRouter,
});

export type AppRouter = typeof appRouter;

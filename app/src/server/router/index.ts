import { t } from "@/server/trpc";

import { comicRouter } from "@/server/router/comicRouter";
import { videoRouter } from "@/server/router/videoRouter";

export const appRouter = t.router({
  ...comicRouter,
  ...videoRouter,
});

export type AppRouter = typeof appRouter;

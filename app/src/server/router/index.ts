import { t } from "@/server/trpc";

import { comicRouter } from "@/server/router/comicRouter";

export const appRouter = t.router({
  ...comicRouter,
});

export type AppRouter = typeof appRouter;

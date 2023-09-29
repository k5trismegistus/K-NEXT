import { initTRPC } from "@trpc/server";
import superjson from "superjson";

import { Comic } from "../../../models/comic";

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  getComics: t.procedure.query(({ ctx }) => {
    return comics.map((comic) => comic.asJson());
  }),
});

export type AppRouter = typeof appRouter;

const comics: Array<Comic> = [
  new Comic({
    id: "1",
    thumbnails: [
      "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80",
    ],
    title: "Comic 1",
    pages: [
      "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D&w=1000&q=80",
    ],
  }),
];

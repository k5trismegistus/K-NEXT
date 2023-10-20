"use client";

import { trpc } from "@/app/api/trpc/trpc-router";
import { useParams } from "next/navigation";
import Viewer from "./viewer";

export default () => {
  const params = useParams();

  if (!params?.id) {
    return <p>Comic not found</p>;
  }

  const comicId: string = params.id as string;

  const { data, isLoading, isFetching } = trpc.showComic.useQuery({
    id: parseInt(comicId),
  });
  const { comic } = data || { comic: null };

  if (isLoading || isFetching) {
    return <p>Loading...</p>;
  }

  if (!comic) {
    return <p>Comic not found</p>;
  }

  return <Viewer comic={comic} />;
};

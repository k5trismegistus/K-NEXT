"use client";

import { trpc } from "@/utils/trpc";
import React from "react";

import { Comic } from "@/models/comic";

export default function ListComics() {
  let { data: comicsResp, isLoading, isFetching } = trpc.getComics.useQuery();

  const comics = comicsResp?.map((cr) => {
    console.log(cr);
    return new Comic(cr);
  });

  if (isLoading || isFetching) {
    return <p>Loading...</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: 20,
      }}
    >
      {comics?.map((comic) => (
        <div
          key={comic.id}
          style={{ border: "1px solid #ccc", textAlign: "center" }}
        >
          <img src={comic.thumbnail} style={{ height: 400, width: 300 }} />
          <h3>{comic.title}</h3>
        </div>
      ))}
    </div>
  );
}

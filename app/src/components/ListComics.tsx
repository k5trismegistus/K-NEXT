"use client";

import { trpc } from "@/app/api/trpc/trpc-router";
import React from "react";

import { Container, Grid, Link, Pagination, Typography } from "@mui/material";
import { useFilterTags, usePage, useQueryTerm } from "@/hooks/queryParamsHooks";
import { ComicWithTags } from "@/types";

type ListComicsProps = {
  comics: ComicWithTags[];
};
const ListComics = ({ comics }: ListComicsProps) => {
  return (
    <Grid container spacing={2}>
      {comics?.map((comic) => (
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={2}
          xl={2}
          key={comic.id}
          style={{
            textAlign: "center",
          }}
        >
          <Link href={`/comics/${comic.id}`}>
            <div style={{ border: "1px solid #ccc", textAlign: "center" }}>
              <div>
                <img
                  src={comic.coverThumbnailKey}
                  style={{ width: "100%", aspectRatio: "3/4" }}
                />
              </div>
              <div className="text-start">
                <Typography
                  className="text-start p-2 text-sm"
                  sx={{
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                >
                  {comic.title}
                </Typography>
              </div>
              <div
                className="border-t-2 text-start p-2"
                style={{ height: "80px" }}
              >
                {comic.taggable.taggings.map((tagging) => (
                  <span className="inline-block m-1 text-sm">
                    #{tagging.tag.name}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

type Props = {
  page: number;
  setPage: (page: number) => void;
  query: string;
  tags: string[];
};
export default ({ page, setPage, query, tags }: Props) => {
  let { data, isLoading, isFetching } = trpc.indexComics.useQuery({
    page,
    query: query,
    tags,
  });

  const { comics, totalPages } = data || {};

  if (isLoading || isFetching) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      {(() => {
        if (isLoading || isFetching) {
          return <p>Loading...</p>;
        }
        if (!comics?.length) {
          return <p>No comics found</p>;
        }
        return <ListComics comics={comics} />;
      })()}

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Pagination
          count={totalPages}
          color="primary"
          page={page}
          onChange={(e, page) => setPage(page)}
        />
      </div>
    </Container>
  );
};

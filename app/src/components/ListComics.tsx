"use client";

import { trpc } from "@/app/api/trpc/trpc-router";
import React from "react";

import { Container, Grid, Pagination } from "@mui/material";
import { useFilterTags, usePage, useQueryTerm } from "@/hooks/queryParamsHooks";

export default () => {
  const { page, setPage } = usePage();
  const { queryTerm: query, setQueryTerm: setQuery } = useQueryTerm();
  const { tags, setFilterTags } = useFilterTags();

  let { data, isLoading, isFetching } = trpc.indexComics.useQuery({
    page,
    query: query,
  });

  const { comics, totalPages } = data || {};

  if (isLoading || isFetching) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
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
            style={{ border: "1px solid #ccc", textAlign: "center" }}
          >
            <img
              src={comic.coverThumbnailUrl}
              style={{ width: "100%", aspectRatio: "3/4" }}
            />
            <p>{comic.title}</p>
          </Grid>
        ))}
      </Grid>
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

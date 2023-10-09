"use client";

import { trpc } from "@/app/api/trpc/trpc-router";
import React from "react";

import { Container, Grid, Pagination } from "@mui/material";
import { Comic } from "@prisma/client";
import { useSearchParams } from "next/navigation";

export default () => {
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams?.get("page")!) || 1;
  const initialQuery = searchParams?.get("q") || "";

  const [comics, setComics] = React.useState<Comic[]>([]);

  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [query, setQuery] = React.useState<string>(initialQuery);
  const [totalPages, setTotalPages] = React.useState(0);

  let { isLoading, isFetching } = trpc.indexComics.useQuery(
    { page: currentPage, query: query },
    {
      queryKey: ["indexComics", { page: currentPage, query }],
      onSuccess: (data) => {
        if (!data) {
          console.log("no data");
          return;
        }
        setComics(data?.comics);
        setTotalPages(data?.totalPages);
      },
    }
  );

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
          onChange={(e, page) => setCurrentPage(page)}
        />
      </div>
    </Container>
  );
};

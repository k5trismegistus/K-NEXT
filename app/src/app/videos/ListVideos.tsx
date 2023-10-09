"use client";

import { trpc } from "@/app/api/trpc/trpc-router";
import React from "react";

import { Container, Grid, Pagination, Typography } from "@mui/material";
import { Video } from "@prisma/client";
import { useSearchParams } from "next/navigation";

export default () => {
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams?.get("page")!) || 1;
  const initialQuery = searchParams?.get("q") || "";

  const [videos, setVideos] = React.useState<Video[]>([]);

  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [query, setQuery] = React.useState<string>(initialQuery);
  const [totalPages, setTotalPages] = React.useState(0);

  let { isLoading, isFetching } = trpc.indexVideos.useQuery(
    { page: currentPage, query: query },
    {
      queryKey: ["indexVideos", { page: currentPage, query }],
      onSuccess: (data) => {
        if (!data) {
          console.log("no data");
          return;
        }
        setVideos(data?.videos);
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
        {videos?.map((video) => (
          <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={video.id}>
            <div style={{ border: "1px solid #ccc", textAlign: "center" }}>
              <div>
                <img
                  src={video.thumbnailUrl}
                  style={{ width: "100%", aspectRatio: "16/9" }}
                />
              </div>

              <div>
                <Typography
                  sx={{
                    fontSize: "14px",
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    height: "44px",
                  }}
                >
                  {video.title}
                </Typography>
              </div>
              <div></div>
            </div>
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

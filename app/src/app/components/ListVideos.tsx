"use client";

import { trpc } from "@/app/api/trpc/trpc-router";
import React from "react";

import { Container, Grid, Pagination, Typography, Link } from "@mui/material";
import { useFilterTags, usePage, useQueryTerm } from "@/hooks/queryParamsHooks";
import { VideoWithTags } from "@/types";

type ListVideosProps = {
  videos: VideoWithTags[];
};
const ListVideos = ({ videos }: ListVideosProps) => {
  return (
    <Grid container spacing={2}>
      {videos?.map((video) => (
        <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={video.id}>
          <Link href={`/videos/${video.id}`}>
            <div style={{ border: "1px solid #ccc", textAlign: "center" }}>
              <div>
                <img
                  src={video.thumbnailUrl}
                  style={{ width: "100%", aspectRatio: "16/9" }}
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
                  {video.title}
                </Typography>
              </div>
              <div
                className="border-t-2 text-start p-2"
                style={{ height: "80px" }}
              >
                {video.taggable.taggings.map((tagging) => (
                  <a
                    href={`/search?tags[]=${tagging.tag.name}`}
                    className="inline-block m-1 text-sm"
                  >
                    #{tagging.tag.name}
                  </a>
                ))}
              </div>
            </div>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default () => {
  const { page, setPage } = usePage();
  const { queryTerm: query, setQueryTerm: setQuery } = useQueryTerm();
  const { tags, setFilterTags } = useFilterTags();

  let { data, isLoading, isFetching } = trpc.indexVideos.useQuery(
    { page, query, tags },
    {
      queryKey: ["indexVideos", { page, query, tags }],
    }
  );

  const { videos, totalPages } = data || {};

  return (
    <Container>
      {(() => {
        if (isLoading || isFetching) {
          return <p>Loading...</p>;
        }
        if (!videos?.length) {
          return <p>No videos found</p>;
        }
        return <ListVideos videos={videos} />;
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

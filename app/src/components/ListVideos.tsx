"use client";

import { trpc } from "@/app/api/trpc/trpc-router";
import React from "react";

import {
  Container,
  Grid,
  Pagination,
  Typography,
  Link,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

import { VideoWithTags } from "@/types";

const ListVideoItem = ({ video }: { video: VideoWithTags }) => {
  const buildThumbnailUrl = (key: string) => {
    return `${process.env.NEXT_PUBLIC_MINIO_EXTERNAL_URL}/${process.env.NEXT_PUBLIC_MINIO_BUCKET}/${key}`;
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
    event.preventDefault();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { isLoading: isDeleting, mutateAsync: deleteVideoMutateAsync } =
    trpc.deleteVideo.useMutation();

  const handleClickDelete = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const videoId = Number(event.currentTarget.value);
    await deleteVideoMutateAsync({ id: videoId });
    window.location.reload();
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <Link href={`/videos/${video.id}`}>
      <div style={{ border: "1px solid #ccc", textAlign: "center" }}>
        <div>
          <img
            src={buildThumbnailUrl(video.thumbnailKey)}
            style={{ width: "100%", aspectRatio: "16/9" }}
          />
        </div>

        <div className="flex justify-between">
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

          <IconButton onClick={handleClick}>
            <MenuIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem>
              <Button
                value={video.id}
                color="error"
                onClick={handleClickDelete}
              >
                Delete
              </Button>
            </MenuItem>
          </Menu>
        </div>
        <div className="border-t-2 text-start p-2" style={{ height: "80px" }}>
          {video.taggable.taggings.map((tagging) => (
            <span className="inline-block m-1 text-sm">
              #{tagging.tag.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

type ListVideosProps = {
  videos: VideoWithTags[];
};
const ListVideos = ({ videos }: ListVideosProps) => {
  return (
    <Grid container spacing={2}>
      {videos?.map((video) => (
        <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={video.id}>
          <ListVideoItem video={video} />
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
  let { data, isLoading, isFetching } = trpc.indexVideos.useQuery(
    { page, query, tags },
    {
      queryKey: ["indexVideos", { page, query, tags }],
    },
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

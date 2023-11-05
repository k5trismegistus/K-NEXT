"use client";

import { trpc } from "@/app/api/trpc/trpc-router";
import React from "react";

import {
  Button,
  Container,
  Grid,
  Link,
  Menu,
  MenuItem,
  Pagination,
  Typography,
  IconButton,
} from "@mui/material";
import { ComicWithTags } from "@/types";
import { Menu as MenuIcon } from "@mui/icons-material";

const ListComicItem = ({ comic }: { comic: ComicWithTags }) => {
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

  const { isLoading: isDeleting, mutateAsync: deleteComicMutateAsync } =
    trpc.deleteComic.useMutation();

  const handleClickDelete = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const comicId = Number(event.currentTarget.value);
    await deleteComicMutateAsync({ id: comicId });
    window.location.reload();
    event.stopPropagation();
    event.preventDefault();
  };

  return (
    <Link href={`/comics/${comic.id}`}>
      <div style={{ border: "1px solid #ccc", textAlign: "center" }}>
        <div>
          <img
            src={buildThumbnailUrl(comic.coverThumbnailKey)}
            style={{ width: "100%", aspectRatio: "3/4" }}
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
              {comic.title}
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
                value={comic.id}
                onClick={handleClickDelete}
                color="error"
              >
                Delete
              </Button>
            </MenuItem>
          </Menu>
        </div>
        <div className="border-t-2 text-start p-2" style={{ height: "80px" }}>
          {comic.taggable.taggings.map((tagging) => (
            <span key={tagging.id} className="inline-block m-1 text-sm">
              #{tagging.tag.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

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
          sm={6}
          md={4}
          lg={2}
          xl={2}
          key={comic.id}
          style={{
            textAlign: "center",
          }}
        >
          <ListComicItem comic={comic} />
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

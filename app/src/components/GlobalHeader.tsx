"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  MenuItem,
  Menu,
} from "@mui/material";
import { VideoLibrary, AutoStories, Upload } from "@mui/icons-material";
import Link from "next/link";
import React from "react";

export default () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" style={{ height: "64px" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          K-NEXT
        </Typography>{" "}
        <Link href="/comics">
          <Button color="inherit">
            <AutoStories />
          </Button>
        </Link>
        <Link href="/videos">
          <Button color="inherit">
            <VideoLibrary />
          </Button>
        </Link>
        <Button
          color="inherit"
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <Upload />
        </Button>
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
            <Link href="/videos/new">
              <Button color="inherit">Upload new video</Button>
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href="/comics/new">
              <Button color="inherit">Upload new comic</Button>
            </Link>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

"use client";

import { trpc } from "@/app/api/trpc/trpc-router";
import React, { useRef } from "react";
import { Container } from "@mui/material";
import { useParams } from "next/navigation";

import {
  FastRewind,
  Replay30,
  Replay10,
  Forward10,
  Forward30,
  FastForward,
} from "@mui/icons-material";

export default () => {
  const params = useParams();

  if (!params?.id) {
    return <p>Video not found</p>;
  }

  const videoId: string = params.id as string;

  const [showingControls, setShowingControls] = React.useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  let { isLoading, isFetching, data } = trpc.showVideo.useQuery({
    id: parseInt(videoId),
  });
  const { video } = data || { video: null };

  if (isLoading || isFetching) {
    return <p>Loading...</p>;
  }

  if (!video) {
    return <p>Video not found</p>;
  }

  return (
    <main style={{ maxWidth: 1200, marginInline: "auto", padding: 20 }}>
      <Container>
        <div className="relative">
          <video
            onClick={(e) => {
              setShowingControls(true);
              e.preventDefault();
            }}
            controls
            src={video.source}
            ref={videoRef}
          />
          {showingControls ? (
            <div
              onClick={() => setShowingControls(false)}
              className="absolute w-full h-full bg-black bg-opacity-50 left-0 top-0 flex items-center justify-around"
            >
              <FastRewind
                onClick={(e) => {
                  videoRef.current?.currentTime != null
                    ? (videoRef.current.currentTime -= 300)
                    : null;
                  e.stopPropagation();
                }}
                className="text-white h-12 w-12"
              />
              <Replay30
                onClick={(e) => {
                  videoRef.current?.currentTime != null
                    ? (videoRef.current.currentTime -= 30)
                    : null;
                  e.stopPropagation();
                }}
                className="text-white h-12 w-12"
              />
              <Replay10
                onClick={(e) => {
                  videoRef.current?.currentTime != null
                    ? (videoRef.current.currentTime -= 10)
                    : null;
                  e.stopPropagation();
                }}
                className="text-white h-12 w-12"
              />
              <Forward10
                onClick={(e) => {
                  videoRef.current?.currentTime != null
                    ? (videoRef.current.currentTime += 10)
                    : null;
                  e.stopPropagation();
                }}
                className="text-white h-12 w-12"
              />
              <Forward30
                onClick={(e) => {
                  videoRef.current?.currentTime != null
                    ? (videoRef.current.currentTime += 30)
                    : null;
                  e.stopPropagation();
                }}
                className="text-white h-12 w-12"
              />
              <FastForward
                onClick={(e) => {
                  videoRef.current?.currentTime != null
                    ? (videoRef.current.currentTime += 300)
                    : null;
                  e.stopPropagation();
                }}
                className="text-white h-12 w-12"
              />
            </div>
          ) : null}
        </div>
        <p>{video.title}</p>
      </Container>
    </main>
  );
};

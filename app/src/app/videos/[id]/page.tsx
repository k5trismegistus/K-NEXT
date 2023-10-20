"use client";

import { trpc } from "@/app/api/trpc/trpc-router";
import React, { useRef } from "react";
import { useParams } from "next/navigation";
import { Container } from "@mui/material";
import { TaggingWithTags } from "@/types";

import {
  FastRewind,
  Replay30,
  Replay10,
  Forward10,
  Forward30,
  FastForward,
  PlayArrow,
  Pause,
} from "@mui/icons-material";
import TagInput from "@/components/tagInput";
import TagChip from "@/components/tagChip";
import { t } from "@/server/trpc";

export default () => {
  const params = useParams();

  if (!params?.id) {
    return <p>Video not found</p>;
  }

  const videoId: string = params.id as string;

  const [showingControls, setShowingControls] = React.useState<boolean>(true);
  const [taggings, setTaggings] = React.useState<TaggingWithTags[]>([]);
  const [playing, setPlaying] = React.useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  let { isLoading, isFetching, data } = trpc.showVideo.useQuery(
    {
      id: parseInt(videoId),
    },
    {
      onSuccess: (data) => {
        setTaggings(data?.video?.taggable.taggings || []);
      },
    },
  );
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
              {playing ? (
                <Pause
                  onClick={(e) => {
                    setPlaying(false);
                    videoRef.current?.pause();
                    e.stopPropagation();
                  }}
                  className="text-white h-12 w-12"
                />
              ) : (
                <PlayArrow
                  onClick={(e) => {
                    setPlaying(true);
                    videoRef.current?.play();
                    e.stopPropagation();
                  }}
                  className="text-white h-12 w-12"
                />
              )}
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
        <div className="row">
          <p>{video.title}</p>
        </div>
        <div className="row">
          {taggings.map((tagging) => (
            <TagChip
              key={tagging.id}
              taggingId={tagging.id}
              label={tagging.tag.name}
              afterDelete={() => {
                setTaggings(taggings.filter((t) => t.id !== tagging.id));
              }}
            />
          ))}
        </div>
        <div className="row">
          <TagInput contentId={video.id} contentType="video" />
        </div>
      </Container>
    </main>
  );
};

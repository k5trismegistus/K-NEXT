"use client";

import { trpc } from "@/app/api/trpc/trpc-router";
import React from "react";
import { useParams } from "next/navigation";
import { Container } from "@mui/material";
import { TaggingWithTags } from "@/types";

import TagInput from "@/components/tagInput";
import TagChip from "@/components/tagChip";
import VideoPlayer from "@/components/VideoPlayer";

export default () => {
  const params = useParams();

  if (!params?.id) {
    return <p>Video not found</p>;
  }

  const videoId: string = params.id as string;

  const [taggings, setTaggings] = React.useState<TaggingWithTags[]>([]);

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
        <VideoPlayer video={video} />
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

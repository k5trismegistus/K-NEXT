import { VideoWithTags } from "@/types";
import {
  FastRewind,
  Replay30,
  Replay10,
  Pause,
  PlayArrow,
  Forward10,
  Forward30,
  FastForward,
} from "@mui/icons-material";
import React, { useRef } from "react";

type Props = {
  video: VideoWithTags;
};

export default ({ video }: Props) => {
  const [playing, setPlaying] = React.useState<boolean>(false);
  const [showingControls, setShowingControls] = React.useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  const buildUrl = (key: string) => {
    return `${process.env.NEXT_PUBLIC_MINIO_EXTERNAL_URL}/${process.env.NEXT_PUBLIC_MINIO_BUCKET}/${key}`;
  };

  return (
    <div className="relative">
      <video
        onClick={(e) => {
          setShowingControls(true);
          e.preventDefault();
        }}
        controls
        src={buildUrl(video.fileKey)}
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
  );
};

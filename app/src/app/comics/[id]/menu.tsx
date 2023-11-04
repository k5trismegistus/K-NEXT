import { Grid } from "@mui/material";
import TagInput from "@/components/tagInput";
import { ComicWithTags } from "@/types";

type ComicViewerProps = {
  comic: ComicWithTags;
  thumbnailKeys: string[];
  page: number;
  setPage: (page: number) => void;
};

export default ({ comic, thumbnailKeys, page, setPage }: ComicViewerProps) => {
  const buildThumbnailUrl = (key: string) => {
    return `${process.env.NEXT_PUBLIC_MINIO_EXTERNAL_URL}/${process.env.NEXT_PUBLIC_MINIO_BUCKET}/${key}`;
  };
  return (
    <div className="flex flex-col items-center">
      <div
        className="p-4 w-full flex"
        style={{ backgroundColor: "white", opacity: "0.9" }}
      >
        <TagInput contentId={comic.id} contentType="comic" />
      </div>

      <div
        className="w-full"
        style={{
          padding: "8px",
        }}
      >
        <Grid container style={{ maxWidth: 1080 }}>
          {thumbnailKeys?.map((thumbnailKey, pageIdx) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              lg={2}
              xl={2}
              key={thumbnailKey}
              onClick={() => setPage(pageIdx)}
              style={{
                padding: "8px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  backgroundColor: pageIdx === page ? "#ccc" : "transparent",
                }}
              >
                <div
                  style={{
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundImage: `url("${buildThumbnailUrl(
                      thumbnailKey,
                    )}")`,
                    width: "100%",
                    aspectRatio: "3/4",
                  }}
                />
              </div>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

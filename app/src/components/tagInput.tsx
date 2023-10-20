import { trpc } from "@/app/api/trpc/trpc-router";
import React from "react";

import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";

type TagInputProps = {
  contentType: "video" | "comic";
  contentId: number;
};

export default ({ contentType, contentId }: TagInputProps) => {
  const [selectedTagNames, setSelectedTagNames] = React.useState<string[]>([]);
  const [inputtingTagFragment, setInputtingTagFragment] = React.useState("");
  let {
    isLoading: loadingTagSuggests,
    isFetching: fetchingTagSuggests,
    data: tagSuggests,
  } = trpc.suggestTagName.useQuery(
    {
      fragment: inputtingTagFragment,
    },
    {
      enabled: inputtingTagFragment.length > 2,
      staleTime: 1000,
    }
  );

  let { isLoading: loadingTagUpdate, mutateAsync: updateTags } =
    trpc.activateTag.useMutation({
      onSuccess: () => {
        setSelectedTagNames([]);
      },
    });

  return (
    <div className="flex w-full">
      <Autocomplete
        className="flex-grow"
        multiple
        freeSolo
        renderInput={(params) => (
          <TextField {...params} label="タグを追加" variant="standard" />
        )}
        onInputChange={(e, value) => setInputtingTagFragment(value)}
        options={tagSuggests?.tagNames || []}
        onChange={(e, newValue) => {
          setSelectedTagNames(newValue);
        }}
      />
      <Button
        onClick={() =>
          updateTags({
            type: contentType,
            id: contentId,
            tagNames: selectedTagNames,
          })
        }
      >
        保存
      </Button>
    </div>
  );
};

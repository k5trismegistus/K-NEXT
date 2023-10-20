"use client";

import { Button, Checkbox, Input } from "@mui/material";
import ListComics from "../../components/ListComics";
import { useState } from "react";
import { useFilterTags, usePage, useQueryTerm } from "@/hooks/queryParamsHooks";
import { trpc } from "../api/trpc/trpc-router";

export default () => {
  const { page, setPage } = usePage();
  const { queryTerm: query, setQueryTerm: setQuery } = useQueryTerm();
  const { tags, setFilterTags } = useFilterTags();

  const [inputtingQuery, setInputtingQuery] = useState("");
  const [openTagselector, setOpenTagselector] = useState(false);

  let { data, isLoading, isFetching } = trpc.indexTags.useQuery({
    type: "comic",
  });
  const { tags: allTags } = data || {};

  const handleCheckedTag = (tag) => {
    if (tags.includes(tag.name)) {
      setFilterTags(tags.filter((t) => t !== tag.name));
    } else {
      setFilterTags([...tags, tag.name]);
    }
  };

  return (
    <div>
      <div className="p-6 w-full flex">
        <Input
          className="flex-grow"
          value={inputtingQuery}
          onChange={(e) => setInputtingQuery(e.target.value)}
          placeholder="Search"
        />
        <Button onClick={() => setQuery(inputtingQuery)}>検索</Button>
        <Button onClick={() => setOpenTagselector(!openTagselector)}>
          タグ
        </Button>
      </div>
      <div
        style={{
          height: openTagselector ? "120px" : "0px",
          transition: "height 0.3s",
          overflowY: openTagselector ? "scroll" : "hidden",
        }}
      >
        {allTags?.map((tag) => (
          <span key={tag.name}>
            <Checkbox
              size="small"
              checked={tags.includes(tag.name)}
              onChange={() => handleCheckedTag(tag)}
            />
            {tag.name}
          </span>
        ))}
      </div>
      <ListComics page={page} setPage={setPage} query={query} tags={tags} />
    </div>
  );
};

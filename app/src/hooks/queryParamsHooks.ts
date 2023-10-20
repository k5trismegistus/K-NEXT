"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const usePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams?.toString());

  const qPage = urlSearchParams.get("page")
    ? Number(urlSearchParams.get("page"))
    : 1;

  const [page, _setPage] = useState(qPage);

  const setPage = (newPage: number) => {
    urlSearchParams.set("page", String(newPage));

    const search = urlSearchParams.toString();
    const query = search ? `?${search}` : "";
    // replace since we don't want to build a history
    _setPage(newPage);
    router.replace(`${pathname}${query}`);
  };

  return { page, setPage };
};

export const useQueryTerm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams?.toString());

  const qQueryTerm = urlSearchParams.get("q") ?? "";
  const [queryTerm, _setQueryTerm] = useState(qQueryTerm);

  const setQueryTerm = (newQueryTerm: string) => {
    urlSearchParams.set("q", queryTerm);

    const search = urlSearchParams.toString();
    const query = search ? `?${search}` : "";
    _setQueryTerm(newQueryTerm);
    // replace since we don't want to build a history
    router.replace(`${pathname}${query}`);
  };

  return { queryTerm, setQueryTerm };
};

export const useFilterTags = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams?.toString());

  const qTags = urlSearchParams.getAll("tags[]").length
    ? urlSearchParams.getAll("tags[]")
    : [];

  const [tags, _setFilterTags] = useState(qTags);

  const setFilterTags = (newTags: string[]) => {
    urlSearchParams.delete("tags[]");
    newTags.forEach((tag) => urlSearchParams.append("tags[]", tag));

    const search = urlSearchParams.toString();
    const query = search ? `?${search}` : "";
    // replace since we don't want to build a history
    _setFilterTags(newTags);
    router.replace(`${pathname}${query}`);
  };

  return { tags, setFilterTags };
};

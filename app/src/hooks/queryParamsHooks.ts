"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const usePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams?.toString());

  // const [page, _setPage] = useState(0);

  const page = urlSearchParams.get("page")
    ? Number(urlSearchParams.get("page"))
    : 1;

  const setPage = (newPage: number) => {
    urlSearchParams.set("page", String(newPage));

    const search = urlSearchParams.toString();
    const query = search ? `?${search}` : "";
    // replace since we don't want to build a history
    // _setPage(newPage);
    router.replace(`${pathname}${query}`);
  };

  // setPage(initialPage);

  return { page, setPage };
};

export const useQueryTerm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams?.toString());

  // const [queryTerm, _setQueryTerm] = useState("");

  // _setQueryTerm(urlSearchParams.get("q") ?? "");
  const queryTerm = urlSearchParams.get("q") ?? "";

  const setQueryTerm = (newQueryTerm: string) => {
    urlSearchParams.set("q", queryTerm);

    const search = urlSearchParams.toString();
    const query = search ? `?${search}` : "";
    // _setQueryTerm(newQueryTerm);
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

  const tags = urlSearchParams.getAll("tags[]").length
    ? urlSearchParams.getAll("tags[]")
    : [];

  const setFilterTags = (newTags: string[]) => {
    urlSearchParams.delete("tags");
    newTags.forEach((tag) => urlSearchParams.append("tags[]", tag));

    const search = urlSearchParams.toString();
    const query = search ? `?${search}` : "";
    // replace since we don't want to build a history
    router.replace(`${pathname}${query}`);
  };

  return { tags, setFilterTags };
};

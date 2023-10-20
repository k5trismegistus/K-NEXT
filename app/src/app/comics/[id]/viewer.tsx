"use client";
import { usePage } from "@/hooks/queryParamsHooks";
import { ComicWithTagsAndPages } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { GridView, NavigateBefore, NavigateNext } from "@mui/icons-material";
import Menu from "./menu";

type ComicViewerProps = {
  comic: ComicWithTagsAndPages;
};
export default ({ comic }: ComicViewerProps) => {
  const { page, setPage } = usePage();
  const [showMenu, setShowMenu] = useState(false);

  const forwardPage = () => {
    setPage(Math.min(page + 1, comic.comicPages.length - 1));
  };

  const backwardPage = () => {
    setPage(Math.max(page - 1, 0));
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => backwardPage(),
    onSwipedRight: () => forwardPage(),
    preventScrollOnSwipe: true,
  });

  const keyDownHandler = useCallback(
    (e: KeyboardEvent) => {
      const key = e.code;
      if (key === "ArrowLeft") {
        backwardPage();
      }

      if (key === "ArrowRight") {
        forwardPage();
      }
    },
    [page]
  );

  useEffect(() => {
    setPage(0);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler, false);
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [keyDownHandler]);

  return (
    <div
      className="relative"
      style={{
        height: "calc(100vh - 64px)",
        overflow: "hidden",
      }}
    >
      <div
        {...handlers}
        className="w-screen"
        style={{
          backgroundImage: `url("${comic.comicPages[page].fileUrl}")`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "calc(100vh - 100px)",
        }}
      ></div>

      <div
        className="absolute w-full"
        style={{
          top: "0",
          height: "calc(100vh - 100px)",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1,
          transform: showMenu ? "translateY(0)" : "translateY(110%)",
          transition: "transform 0.2s ease",
        }}
      >
        <Menu
          comic={comic}
          thumbnailUrls={comic.comicPages.map((p) => p.thumbnailUrl)}
          page={page}
          setPage={setPage}
        />
      </div>

      <div
        className="flex absolute bottom-0 w-full"
        style={{ height: "36px", zIndex: 100 }}
      >
        <div
          onClick={backwardPage}
          className="flex flex-auto justify-center items-center"
        >
          <NavigateBefore />
        </div>
        <div
          className="flex flex-auto justify-center items-center"
          onClick={() => setShowMenu(!showMenu)}
        >
          <GridView />
        </div>
        <div
          onClick={forwardPage}
          className="flex flex-auto justify-center items-center"
        >
          <NavigateNext />
        </div>
      </div>
    </div>
  );
};

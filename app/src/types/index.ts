import { Video, Prisma } from "@prisma/client";

export type VideoWithTags = Prisma.VideoGetPayload<{
  include: {
    taggable: {
      include: {
        taggings: {
          include: {
            tag: true;
          };
        };
      };
    };
  };
}>;

export type ComicWithTags = Prisma.ComicGetPayload<{
  include: {
    taggable: {
      include: {
        taggings: {
          include: {
            tag: true;
          };
        };
      };
    };
  };
}>;

export type ComicWithTagsAndPages = Prisma.ComicGetPayload<{
  include: {
    taggable: {
      include: {
        taggings: {
          include: {
            tag: true;
          };
        };
      };
    };
    comicPages: true;
  };
}>;

export type TaggingWithTags = Prisma.TaggingGetPayload<{
  include: {
    tag: true;
  };
}>;

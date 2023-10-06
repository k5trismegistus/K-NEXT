-- CreateTable
CREATE TABLE "Comic" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "coverThumbnailUrl" VARCHAR(255) NOT NULL,
    "coverUrl" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taggableId" INTEGER NOT NULL,

    CONSTRAINT "Comic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComicPage" (
    "id" SERIAL NOT NULL,
    "fileUrl" VARCHAR(255) NOT NULL,
    "thumbnailUrl" VARCHAR(255) NOT NULL,
    "comicId" INTEGER NOT NULL,

    CONSTRAINT "ComicPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "source" VARCHAR(255) NOT NULL,
    "thumbnailUrl" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taggableId" INTEGER NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Taggable" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Taggable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tagging" (
    "id" SERIAL NOT NULL,
    "tagId" INTEGER NOT NULL,
    "videoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taggableId" INTEGER NOT NULL,

    CONSTRAINT "Tagging_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Comic_uuid_key" ON "Comic"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Comic_taggableId_key" ON "Comic"("taggableId");

-- CreateIndex
CREATE UNIQUE INDEX "Video_uuid_key" ON "Video"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Video_taggableId_key" ON "Video"("taggableId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "Tagging_tagId_taggableId_idx" ON "Tagging"("tagId", "taggableId");

-- CreateIndex
CREATE UNIQUE INDEX "Tagging_tagId_taggableId_key" ON "Tagging"("tagId", "taggableId");

-- AddForeignKey
ALTER TABLE "Comic" ADD CONSTRAINT "Comic_taggableId_fkey" FOREIGN KEY ("taggableId") REFERENCES "Taggable"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ComicPage" ADD CONSTRAINT "ComicPage_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_taggableId_fkey" FOREIGN KEY ("taggableId") REFERENCES "Taggable"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Tagging" ADD CONSTRAINT "Tagging_taggableId_fkey" FOREIGN KEY ("taggableId") REFERENCES "Taggable"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

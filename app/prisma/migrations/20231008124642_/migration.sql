/*
  Warnings:

  - Added the required column `index` to the `ComicPage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tagging" DROP CONSTRAINT "Tagging_taggableId_fkey";

-- AlterTable
ALTER TABLE "ComicPage" ADD COLUMN     "index" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Tagging" ADD CONSTRAINT "Tagging_taggableId_fkey" FOREIGN KEY ("taggableId") REFERENCES "Taggable"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Tagging" ADD CONSTRAINT "Tagging_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

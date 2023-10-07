"use client";

import { trpc } from "@/app/api/trpc/trpc-router";

import React, { useState, useCallback } from "react";

import { useDropzone } from "react-dropzone";

import styles from "./page.module.css";
import { useMutation } from "@tanstack/react-query";

export default () => {
  // debug
  const isLoading = false;

  const { mutateAsync: createComicMutateAsync } =
    trpc.createComic.useMutation();

  const { mutateAsync: completeUploadComicMutateAsync } =
    trpc.completeUploadComic.useMutation();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const bookFile = acceptedFiles[0];
    const key = `comicuploads/${bookFile.name}`;

    const { presignedUrl, comic } = await createComicMutateAsync({
      key,
    });

    await fetch(presignedUrl, {
      method: "PUT",
      body: bookFile,
    });

    await completeUploadComicMutateAsync({
      key,
      id: comic.id,
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={styles.container}>
      <h1>Upload new books</h1>

      <div
        {...getRootProps()}
        className={isLoading ? styles.hiddenDropArea : styles.dropArea}
      >
        <input {...getInputProps()}></input>
        {isDragActive ? <p>Drop file here</p> : <p>Start</p>}
      </div>

      <div
        className={
          isLoading ? styles.waitMessageArea : styles.hiddenWaitMessageArea
        }
      >
        <p>Uploading...</p>
      </div>

      <div>
        <h2>Uploaded</h2>
      </div>
    </div>
  );
};

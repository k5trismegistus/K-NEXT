"use client";

import { trpc } from "@/app/api/trpc/trpc-router";

import React, { useState, useCallback } from "react";

import { useDropzone } from "react-dropzone";

import { Box, Card, Container } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default () => {
  const [uploadedFilenames, setUploadedFilenames] = useState<string[]>([]); // [
  const { isLoading: isUploading, mutateAsync: createComicMutateAsync } =
    trpc.createComic.useMutation();

  const {
    isLoading: isGenerating,
    isSuccess: isGenerated,
    mutateAsync: completeUploadComicMutateAsync,
  } = trpc.completeUploadComic.useMutation();

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

    setUploadedFilenames([...uploadedFilenames, bookFile.name]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <main>
      <Container style={{ padding: 12 }}>
        <Box>
          <Card style={{ padding: 12 }}>
            <h2>Upload new comic</h2>
            <div>
              <h3>Upload new comic</h3>
              <div
                {...getRootProps()}
                style={{
                  margin: "60px auto",
                  height: 80,
                  width: 320,
                  border: "4px solid gray",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: isDragActive ? "lightgray" : "white",
                }}
              >
                <AddIcon style={{ fontSize: 40 }} />
                <input {...getInputProps()}></input>
                {isUploading || isGenerating ? (
                  <p>Uploading...</p>
                ) : isDragActive ? (
                  <p>Drop file here</p>
                ) : (
                  <p>Start</p>
                )}
              </div>
              <div>
                <h3>Uploaded comics</h3>

                {uploadedFilenames.map((filename, idx) => (
                  <div key={idx}>{filename}</div>
                ))}
              </div>
            </div>
          </Card>
        </Box>
      </Container>
    </main>
  );
};

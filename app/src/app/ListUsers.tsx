"use client";

import { trpc } from "@/app/api/trpc/trpc-router";
import React from "react";

export default function ListUsers() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: 20,
      }}
    >
      <h1>K-NEXT</h1>
    </div>
  );
}

import { TrpcProvider } from "@/utils/trpc-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import React from "react";
import GlobalHeader from "@/components/GlobalHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "K-NEXT",
  description: "K-NEXT is the platform of multimedia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width;initial-scale=1" />
      </head>
      <body className={inter.className}>
        <GlobalHeader />
        <TrpcProvider>{children}</TrpcProvider>
      </body>
    </html>
  );
}

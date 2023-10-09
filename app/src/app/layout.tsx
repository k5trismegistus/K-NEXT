import { TrpcProvider } from "@/utils/trpc-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";
import App from "next/app";

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
      <body className={inter.className}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              K-NEXT
            </Typography>{" "}
            <Link href="/comics">
              <Button color="inherit">Read comics</Button>
            </Link>
            <Link href="/comics/new">
              <Button color="inherit">Upload new comic</Button>
            </Link>
            <Link href="/videos">
              <Button color="inherit">Watch videos</Button>
            </Link>
            <Link href="/videos/new">
              <Button color="inherit">Upload new video</Button>
            </Link>
          </Toolbar>
        </AppBar>
        <TrpcProvider>{children}</TrpcProvider>
      </body>
    </html>
  );
}

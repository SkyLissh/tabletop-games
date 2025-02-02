import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/app/globals.css";

import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-slate-200 text-foreground dark:bg-slate-800`}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}

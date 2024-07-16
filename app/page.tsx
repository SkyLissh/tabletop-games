"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Dice5, PencilRuler, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  const discordUrl = process.env.NEXT_PUBLIC_DISCORD_OAUTH_URL;
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-40 p-4">
      <div className="flex flex-col items-center gap-4">
        <h1 className="flex flex-row items-center gap-4 text-2xl font-bold md:text-6xl">
          <Dice5 className="size-8 md:size-20" />
          Tabletop Games
        </h1>

        <q className="text-base italic md:text-xl">Roll Together, Laugh Together</q>
      </div>

      <div className="flex w-full flex-col gap-4 md:w-1/3">
        <Button asChild className="h-12 text-lg">
          <Link href={`${discordUrl}&redirect_uri=${encodeURIComponent(`${url}join`)}`}>
            <UsersRound className="size-5" /> Join
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-12 text-lg">
          <Link href={`${discordUrl}&redirect_uri=${encodeURIComponent(`${url}create`)}`}>
            <PencilRuler className="size-5" /> Create
          </Link>
        </Button>
      </div>
    </main>
  );
}

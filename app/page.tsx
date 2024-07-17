import Image from "next/image";
import Link from "next/link";

import { Dice5, PencilRuler, UsersRound } from "lucide-react";
import { getServerSession } from "next-auth/next";

import { LoginButton } from "@/components/login-button";
import { Button } from "@/components/ui/button";

import { authOptions } from "@/lib/auth-options";
import { cn } from "@/lib/utils";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main
      className={cn(
        "flex min-h-screen flex-col items-center justify-center p-4",
        !session ? "gap-40" : "gap-10"
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <h1 className="flex flex-row items-center gap-4 text-2xl font-bold md:text-6xl">
          <Dice5 className="size-8 md:size-20" />
          Tabletop Games
        </h1>

        <q className="text-base italic md:text-xl">Roll Together, Laugh Together</q>
      </div>

      {session && (
        <div className="flex flex-row items-center gap-4">
          <Image
            src={session.user?.image_url ?? ""}
            alt={session.user?.username ?? "Profile image"}
            className="rounded-full"
            width={48}
            height={48}
          />
          <p className="text-lg font-semibold">{session.user?.username}</p>
        </div>
      )}

      <div className="flex w-full flex-col gap-4 md:w-1/3">
        {!session && <LoginButton />}
        {session && (
          <>
            <Button asChild className="h-12 text-lg">
              <Link href="/join">
                <UsersRound className="size-5" /> Join
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 text-lg">
              <Link href="/create">
                <PencilRuler className="size-5" /> Create
              </Link>
            </Button>
          </>
        )}
      </div>
    </main>
  );
}

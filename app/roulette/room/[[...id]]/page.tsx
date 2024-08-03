"use client";

import { useEffect } from "react";

import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Player } from "@lottiefiles/react-lottie-player";
import { DoorOpen } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  connectToColyseus,
  disconnectFromColyseus,
  useColyseusRoom,
  useColyseusState,
} from "@/hooks/use-colyseus";

import { RouletteResultDialog } from "@/components/dialogs/roulette-result-dialog";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { fetchRouletteById } from "@/actions/roulette";
import { useToast } from "@/components/ui/use-toast";
import type { Roulette } from "@/schemas/roulette";
import Link from "next/link";

const RouletteWheel = dynamic(
  () => import("@/components/roulette").then((mod) => mod.Roulette),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[445px] w-full items-center justify-center md:w-[445px]">
        <Player autoplay loop src="/loader.json" className="size-32" />
      </div>
    ),
  }
);

export default function RouletteRoomPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const params = useSearchParams();
  const rouletteId = params.get("rouletteId");
  const { data: session, status: sessionStatus } = useSession();
  const { toast } = useToast();

  const room = useColyseusRoom();

  const currentPlayer = useColyseusState((state) => state.currentPlayer);
  const rouletteName = useColyseusState((state) => state.name);
  const options = useColyseusState((state) => state.options);

  const onResult = (result: string) => {
    if (!room) return;
    room.send("spinned", { result });
  };

  const onCopyToClipboard = async () => {
    await navigator.clipboard.writeText(room?.id ?? "");

    toast({
      duration: 1000,
      title: "Copied to clipboard",
    });
  };

  const connect = async () => {
    if (sessionStatus !== "authenticated") return;
    const user = session?.user;

    let roulette: Roulette | undefined;
    if (rouletteId) {
      roulette = await fetchRouletteById(rouletteId);
    }

    try {
      await connectToColyseus("roulette", {
        roomId: id,
        options: {
          roulette,
          player: {
            name: user?.username,
            image: user?.image_url,
          },
        },
      });
    } catch {
      if (rouletteId) return;
      router.push("/");
    }
  };

  useEffect(() => {
    connect();
    return () => {
      disconnectFromColyseus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStatus]);

  useEffect(() => {
    if (!room) return;

    window.history.replaceState(null, "", `/roulette/room/${room?.id}`);
  }, [room]);

  if (!session || !room) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-10">
        <Player autoplay loop src="/loader.json" className="size-40" />
      </div>
    );
  }

  return (
    <main className="flex max-h-screen flex-col items-center gap-4">
      <nav className="container left-0 top-0 flex flex-row items-center justify-end p-4">
        <Button variant="destructive" asChild>
          <Link href="/">
            <DoorOpen className="size-5" />
            Left room
          </Link>
        </Button>
      </nav>
      <div className="flex flex-row items-center gap-4 px-10">
        <h1 className="text-xl font-bold">{rouletteName}</h1>
        <button
          className={cn(badgeVariants({ variant: "default" }), "hover:cursor-pointer")}
          onClick={() => onCopyToClipboard()}
        >
          {room?.id}
        </button>
      </div>

      <div className="flex flex-col gap-6 px-10 md:flex-row">
        <RouletteWheel
          enabled={room && room?.sessionId === currentPlayer}
          onResult={onResult}
          options={
            options?.map((option) => ({
              option: option.name,
              style: {
                backgroundColor: option.textColor ?? undefined,
                textColor: option.backgroundColor ?? undefined,
                fontSize: option.name.length > 10 ? 15 : undefined,
              },
            })) ?? []
          }
        />
        <PlayersList currentPlayer={currentPlayer} />
        <RouletteResultDialog />
      </div>
    </main>
  );
}

function PlayersList({ currentPlayer }: { currentPlayer?: string }) {
  const players = useColyseusState((state) => state.players);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Players</h2>
      {players?.map((player) => (
        <div key={player.sessionId} className="flex flex-row items-center gap-2">
          <Image
            className={cn(
              "rounded-full",
              player.sessionId === currentPlayer &&
                "outline outline-2 outline-offset-2 outline-green-500"
            )}
            src={player.image}
            alt={player.name}
            width={42}
            height={42}
          />
          <p className="text-lg font-medium">{player.name}</p>
        </div>
      ))}
    </div>
  );
}

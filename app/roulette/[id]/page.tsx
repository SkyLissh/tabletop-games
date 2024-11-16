import Link from "next/link";

import { PencilRuler } from "lucide-react";

import { ReturnButton } from "@/components/return-button";
import { RouletteForm } from "@/components/roulette-form";
import { Button } from "@/components/ui/button";

import { fetchRouletteById } from "@/actions/roulette";

export default async function Page({ id }: { id: string }) {
  const roulette = await fetchRouletteById(id);

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-10">
      <nav className="container fixed left-0 top-0 flex flex-row items-center justify-between p-4">
        <ReturnButton />
        <Button asChild>
          <Link href={`/roulette/room?rouletteId=${id}`}>
            <PencilRuler className="size-5" />
            Create room
          </Link>
        </Button>
      </nav>
      <RouletteForm id={id} roulette={roulette} />
    </main>
  );
}

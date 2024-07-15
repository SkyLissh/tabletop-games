import { Dice5, PencilRuler, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-40 p-4">
      <h1 className="flex flex-row items-center gap-4 text-6xl font-bold">
        <Dice5 className="size-12 md:size-20" />
        Tabletop Games
      </h1>

      <div className="flex w-full flex-col gap-4 md:w-1/3">
        <Button className="h-12 text-lg">
          <UsersRound className="size-5" /> Join
        </Button>
        <Button variant="outline" className="h-12 text-lg">
          <PencilRuler className="size-5" /> Create
        </Button>
      </div>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";

import { Plus } from "lucide-react";

import { fetchAllRoulettes } from "@/actions/roulette";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { CreateRouletteDialog } from "@/components/dialogs/create-roulette-diaog";

export default async function Create() {
  const roulettes = await fetchAllRoulettes();

  return (
    <main className="container flex min-h-screen flex-col items-center justify-center gap-12 py-10">
      <h2 className="text-2xl font-medium">Your Roulettes</h2>
      <div className="flex flex-row flex-wrap items-center gap-8">
        {roulettes.map((roulette) => (
          <Link key={roulette.id} href={`/roulette/${roulette.id}`}>
            <article className="flex w-36 flex-col items-center rounded-md border border-slate-400 hover:cursor-pointer hover:border-indigo-600 hover:bg-indigo-100 dark:border-slate-600 dark:hover:border-indigo-500 dark:hover:bg-indigo-600/10">
              <div className="p-4">
                <Image src="/roulette.webp" alt="Roulette" width={80} height={80} />
              </div>
              <div className="flex w-full items-center justify-center rounded-b-md bg-slate-300 p-4 dark:bg-slate-700">
                <p className="text-sm">{roulette.name}</p>
              </div>
            </article>
          </Link>
        ))}
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <Plus className="size-5 text-indigo-500 dark:text-indigo-300" />
            </Button>
          </DialogTrigger>
          <CreateRouletteDialog />
        </Dialog>
      </div>
    </main>
  );
}

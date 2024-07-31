import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { createRoulette } from "@/actions/roulette";

export function CreateRouletteDialog() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create roulette</DialogTitle>
        <DialogDescription>Create a new roulette</DialogDescription>
      </DialogHeader>
      <form action={createRoulette} className="flex flex-col gap-4">
        <Input placeholder="Roulette name" name="name" />
        <Button>Create</Button>
      </form>
    </DialogContent>
  );
}

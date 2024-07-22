import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { useColyseusRoom } from "@/hooks/use-colyseus";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";

export function RouletteResultDialog() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState("");
  const [winnerPlayer, setWinnerPlayer] = useState<string | null>(null);
  const room = useColyseusRoom();

  useEffect(() => {
    if (!room) return;

    room.onMessage(
      "spinned",
      ({ result, player }: { result: string; player: string }) => {
        setResult(result);
        setWinnerPlayer(player);
        setOpen(true);
      }
    );
  }, [room]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="flex flex-col items-center justify-center">
          <DialogTitle className="text-2xl">{`"${result}"`}</DialogTitle>
          <DialogDescription className="text-lg">{winnerPlayer}</DialogDescription>
        </DialogHeader>
        <Button type="submit">Understood</Button>
      </DialogContent>
    </Dialog>
  );
}

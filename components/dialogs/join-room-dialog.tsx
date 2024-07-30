"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function JoinRoomDialog() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const onJoin = () => {
    router.push(`/roulette/room/${code}`);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Join room</DialogTitle>
        <DialogDescription>Enjoy with your friends, and join them!</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Room code"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button onClick={onJoin}>Join</Button>
      </div>
    </DialogContent>
  );
}

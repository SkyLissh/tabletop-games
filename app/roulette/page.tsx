"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { CircleX, Plus } from "lucide-react";
import { type WheelDataType } from "react-custom-roulette";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Roulette = dynamic(
  () => import("@/components/roulette").then((mod) => mod.Roulette),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

export default function Page() {
  const [spin, setSpin] = useState(false);
  const [prize, setPrize] = useState(0);

  const options: WheelDataType[] = [
    { option: "Tomar x2" },
    { option: "Tomar x3" },
    { option: "Tomar x4" },
    { option: "Tomar x5" },
  ];

  const onSpin = () => {
    if (spin) return;

    const option = Math.floor(Math.random() * options.length);

    setSpin(true);
    setPrize(option);
  };

  const onStopSpinning = () => {
    setSpin(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-10">
      <h1 className="text-xl font-bold">Roulette name</h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        <Roulette
          options={options}
          startSpinning={spin}
          winner={prize}
          onStopSpinning={onStopSpinning}
          onSpin={onSpin}
        />

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">Edit roulette</h2>
          <Input placeholder="Roulette name" />

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">Options</h3>
            {options.map((option, index) => (
              <div key={index} className="flex flex-row gap-4">
                <Input placeholder="Name" value={option.option} />
                <Input placeholder="Text color" value={option.style?.textColor} />
                <Input
                  placeholder="Background color"
                  value={option.style?.backgroundColor}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-none rounded-full hover:bg-red-200"
                >
                  <CircleX className="text-red-500" />
                </Button>
              </div>
            ))}
            <Button>
              <Plus className="size-4" />
              Add option
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

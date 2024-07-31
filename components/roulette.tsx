"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

import type { WheelDataType } from "react-custom-roulette";
import { Wheel } from "react-custom-roulette";

import { Player } from "@lottiefiles/react-lottie-player";

type Props = {
  onResult?: (result: string, index: number) => void;
  enabled?: boolean;
  options?: WheelDataType[];
};

export function Roulette({ options, onResult, enabled }: Props) {
  const [winner, setWinner] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const onSpin = () => {
    if (spinning || !enabled) return;

    const option = Math.floor(Math.random() * options!.length);

    setSpinning(true);
    setWinner(option);
  };

  const onStopSpinning = () => {
    onResult?.(options![winner].option!, winner);
    setSpinning(false);
  };

  if (!options || options?.length === 0) {
    return (
      <div className="flex h-[445px] w-full items-center justify-center md:w-[445px]">
        <Player autoplay loop src="/loader.json" className="size-32" />
      </div>
    );
  }

  return (
    <div
      className={cn("relative flex items-center justify-center", !enabled && "grayscale")}
    >
      <Wheel
        data={options!}
        mustStartSpinning={spinning}
        prizeNumber={winner}
        onStopSpinning={onStopSpinning}
        outerBorderWidth={8}
        backgroundColors={["#fbbf24", "#ef4444", "#0ea5e9", "#34d399"]}
        textColors={["#000", "#fff", "#fff", "#000"]}
        innerRadius={25}
      />
      <button
        className={cn(
          "absolute left-1/2 top-1/2 z-10 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-slate-900 bg-indigo-500 font-bold text-slate-100 hover:cursor-pointer",
          !enabled && "hover:cursor-not-allowed"
        )}
        onClick={onSpin}
      >
        Spin it!
      </button>
    </div>
  );
}

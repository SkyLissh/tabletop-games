"use client";

import { useState } from "react";

import type { WheelDataType } from "react-custom-roulette";
import { Wheel } from "react-custom-roulette";

type Props = {
  options: WheelDataType[];
};

export function Roulette({ options }: Props) {
  const [winner, setWinner] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const onSpin = () => {
    if (spinning) return;

    const option = Math.floor(Math.random() * options.length);

    setSpinning(true);
    setWinner(option);
  };

  const onStopSpinning = () => {
    setSpinning(false);
  };

  return (
    <div className="relative flex items-center justify-center">
      <Wheel
        data={options}
        mustStartSpinning={spinning}
        prizeNumber={winner}
        onStopSpinning={onStopSpinning}
        outerBorderWidth={8}
        backgroundColors={["#fbbf24", "#ef4444", "#0ea5e9", "#34d399"]}
        textColors={["#000", "#fff", "#fff", "#000"]}
        innerRadius={25}
      />
      <button
        className="absolute left-1/2 top-1/2 z-10 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-slate-900 bg-indigo-500 font-bold text-slate-100"
        onClick={onSpin}
      >
        Spin it!
      </button>
    </div>
  );
}

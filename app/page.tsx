"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { type WheelDataType } from "react-custom-roulette";

import { Button } from "@/components/ui/button";

const Wheel = dynamic(() => import("react-custom-roulette").then((mod) => mod.Wheel), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function Home() {
  const [spin, setSpin] = useState(false);
  const [prize, setPrize] = useState(0);

  const options: WheelDataType[] = [
    { option: "Tomar x2", style: { backgroundColor: "#00ff00" } },
    { option: "Tomar x3", style: { backgroundColor: "#0000ff" } },
    { option: "Tomar x4", style: { backgroundColor: "#ff0000" } },
    { option: "Tomar x5", style: { backgroundColor: "#ff00ff" } },
  ];

  const onSpin = () => {
    const option = Math.floor(Math.random() * options.length);

    setSpin(true);
    setPrize(option);
  };

  const onStopSpinning = () => {
    setSpin(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-xl font-bold">Hello world</h1>
      <Button onClick={onSpin}>Spin</Button>
      <Wheel
        data={options}
        mustStartSpinning={spin}
        prizeNumber={prize}
        onStopSpinning={onStopSpinning}
      />
    </main>
  );
}

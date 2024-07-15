import type { WheelDataType } from "react-custom-roulette";
import { Wheel } from "react-custom-roulette";

type Props = {
  options: WheelDataType[];
  startSpinning: boolean;
  winner: number;
  onStopSpinning: () => void;
  onSpin: () => void;
};

export function Roulette({
  options,
  startSpinning,
  winner,
  onStopSpinning,
  onSpin,
}: Props) {
  return (
    <div className="relative">
      <Wheel
        data={options}
        mustStartSpinning={startSpinning}
        prizeNumber={winner}
        onStopSpinning={onStopSpinning}
        outerBorderWidth={8}
        backgroundColors={["#87CEEB", "#FFC0CB"]}
      />
      <button
        className="absolute left-1/2 top-1/2 z-10 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-zinc-900 bg-amber-400 font-bold"
        onClick={onSpin}
      >
        Spin it!
      </button>
    </div>
  );
}

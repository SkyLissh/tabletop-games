import { z } from "zod";

export const RouletteOption = z.object({
  id: z.string().cuid2(),
  name: z.string().max(255),
  textColor: z.string().max(7).startsWith("#").nullable(),
  backgroundColor: z.string().max(7).startsWith("#").nullable(),
  rouletteId: z.string().cuid2().nullable(),
});

export type RouletteOption = z.infer<typeof RouletteOption>;

export const Roulette = z.object({
  name: z.string().max(255),
  options: z.array(RouletteOption),
});

export type Roulette = z.infer<typeof Roulette>;

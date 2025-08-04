import * as random from "@/app/lib/random";

export type Prize = {
  name: string;
  count: number;
};

export type DrawResult = {
  name: string;
  prize: string;
};

export type DrawRules = {
  repeat: "no-repeat" | "allow-repeat";
  order: "first" | "last";
};

export function draw(
  candidates: ReadonlyArray<string>,
  prizes: ReadonlyArray<Prize>,
  drawRules: Readonly<DrawRules>
): DrawResult[] {
  const individualPrizes: string[] = prizes.flatMap((prize: Prize) =>
    Array.from({ length: prize.count }, () => prize.name)
  );

  const drawNoRepeat = (
    candidates: ReadonlyArray<string>,
    prizes: ReadonlyArray<string>
  ): DrawResult[] => {
    const shuffledCandidates = random.fisherYatesShuffle<string>(candidates);
    return prizes.map((prize: string, i: number) => ({
      name: shuffledCandidates[i],
      prize: prize,
    }));
  };
  const drawAllowRepeat = (
    candidates: ReadonlyArray<string>,
    prizes: ReadonlyArray<string>
  ): DrawResult[] => (
    prizes.map((prize: string) => ({
      name: candidates[random.getRandomValue(0, candidates.length-1)],
      prize: prize,
    }))
  );
  const drawingStrategy = {
    "no-repeat": drawNoRepeat,
    "allow-repeat": drawAllowRepeat
  };

  return drawingStrategy[drawRules.repeat](candidates, individualPrizes);
}
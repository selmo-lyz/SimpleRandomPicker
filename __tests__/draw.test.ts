import { Prize, DrawRules, draw, DrawResult } from "../src/app/lib/draw";

describe("draw()", () => {
  const candidates = ["A", "B", "C"];
  const prizes = [
    { name: "Gold", count: 1 },
    { name: "Silver", count: 2 },
    { name: "Bronze", count: 3 },
  ];

  it("should draw all prizes at one time, starting from the first prize, and do not have repeat winners", () => {
    const result = draw(candidates, prizes.slice(0, 2), {
      repeat: "no-repeat",
      order: "first",
    });

    expect(result.map((r) => r.prize)).toEqual(
      prizes
        .slice(0, 2)
        .flatMap((r) => Array.from({ length: r.count }, () => r.name)),
    );
  });

  it("should draw all prizes at one time, starting from the last prize, and do not have repeat winners", () => {
    const result = draw(candidates, prizes.slice(2, 3), {
      repeat: "no-repeat",
      order: "last",
    });

    expect(result.map((r) => r.prize)).toEqual(
      prizes
        .slice(2, 3)
        .flatMap((r) => Array.from({ length: r.count }, () => r.name)),
    );
  });

  it("should draw all prizes at one time, starting from the first prize, and have repeat winners", () => {
    const result = draw(candidates.slice(0, 1), prizes, {
      repeat: "allow-repeat",
      order: "first",
    });

    expect(result.every((r) => r.name === "A")).toBe(true);
  });
});

import { Prize, DrawRules, draw, DrawResult } from "../src/app/lib/draw";

type testCase = {
  candidates: ReadonlyArray<string>;
  prizes: ReadonlyArray<Prize>;
};

const testCases: testCase[] = [
  {
    candidates: ["CandidateA", "CandidateB", "CandidateC", "CandidateD"],
    prizes: [
      { name: "PrizeA", count: 1 },
      { name: "PrizeB", count: 2 },
    ],
  },
  {
    candidates: ["CandidateA", "CandidateB", "CandidateC"],
    prizes: [
      { name: "PrizeA", count: 1 },
      { name: "PrizeB", count: 2 },
    ],
  },
  {
    candidates: ["CandidateA", "CandidateB", "CandidateC"],
    prizes: [
      { name: "PrizeA", count: 1 },
      { name: "PrizeB", count: 2 },
      { name: "PrizeC", count: 3 },
    ],
  },
  {
    candidates: ["CandidateA", "CandidateB", "CandidateC", "CandidateD"],
    prizes: [],
  },
  {
    candidates: [],
    prizes: [],
  },
  {
    candidates: [],
    prizes: [
      { name: "PrizeA", count: 1 },
      { name: "PrizeB", count: 2 },
    ],
  },
];

describe.each(testCases)("draw()", ({ candidates, prizes }) => {
  describe("when winners can not be duplicate", () => {
    it("draws some prizes for candidates", () => {
      // GIVEN: candidates and prizes
      // WHEN: draw() is called
      const result = draw(candidates, prizes, {
        repeat: "no-repeat",
        order: "first",
      });

      // THEN: all results should be valid candidates and prizes
      result.forEach((r) => {
        expect(candidates).toContain(r.name);
        expect(prizes.map((p) => p.name)).toContain(r.prize);
      });
    });

    it("returns unique winners when candidates is equal to or more than prizes", () => {
      // GIVEN: candidates and prizes
      // WHEN: draw() is called
      const results = Array.from({ length: 1e3 }, () =>
        draw(candidates, prizes, {
          repeat: "no-repeat",
          order: "first",
        }),
      );

      // THEN: there should be no duplicate winners
      const noDuplicateWinners = results.every((result) => {
        const winners = result.map((r) => r.name);
        return new Set(winners).size === winners.length;
      });
      expect(noDuplicateWinners).toBe(true);
    });
  });

  describe("when winners can be duplicate", () => {
    it("draws some prizes for candidates", () => {
      // GIVEN: candidates and prizes
      // WHEN: draw() is called
      const result = draw(candidates, prizes, {
        repeat: "allow-repeat",
        order: "first",
      });

      // THEN: all results should be valid candidates and prizes
      result.forEach((r) => {
        expect(candidates).toContain(r.name);
        expect(prizes.map((p) => p.name)).toContain(r.prize);
      });
    });

    it("may return duplicate winners", () => {
      // GIVEN: candidates and prizes
      // WHEN: draw() is called
      const results = Array.from({ length: 1e3 }, () =>
        draw(candidates, prizes, {
          repeat: "allow-repeat",
          order: "first",
        }),
      );

      // THEN: there may be duplicate winners
      const haveDuplicateWinners = results.some((result) => {
        const winners = result.map((r) => r.name);
        return new Set(winners).size <= winners.length;
      });
      expect(haveDuplicateWinners).toBe(true);
    });
  });
});

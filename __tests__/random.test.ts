import * as random from "../src/app/lib/random";

describe("getRandomValue()", () => {
  it("should generate a random number in the specific range", () => {
    const randomValue = random.getRandomValue(0, 100);
    expect(randomValue >= 0 && randomValue <= 100).toBe(true);
  });
});

describe("fisherYatesShuffle()", () => {
  it("should not mutate the original array", () => {
    const originalArray = Array.from({ length: 100 }, (_, idx) => idx + 1);
    const copyOriginal = [...originalArray];
    const _ = random.fisherYatesShuffle<number>(originalArray);

    expect(originalArray).toEqual(copyOriginal);
  });

  it("should return an array with the same elements", () => {
    const originalArray = Array.from({ length: 100 }, (_, idx) => idx + 1);
    const shuffledArray = random.fisherYatesShuffle<number>(originalArray);

    expect(shuffledArray.sort((a, b) => a - b)).toEqual(originalArray);
  });
});
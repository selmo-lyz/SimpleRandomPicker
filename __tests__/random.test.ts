import * as random from "../src/app/lib/random";

describe("getRandomValue()", () => {
  it("generates a random number in the specific range", () => {
    // GIVEN: a range
    const range = {
      min: 0,
      max: 2,
    };

    for (let i = 0; i < 1e3; ++i) {
      // WHEN: it generates a random number
      const randomValue = random.getRandomValue(range.min, range.max);

      // THEN: the random number should be within the range
      expect(randomValue).toBeGreaterThanOrEqual(range.min);
      expect(randomValue).toBeLessThanOrEqual(range.max);
    }
  });
});

describe("fisherYatesShuffle()", () => {
  it("should not mutate the original array", () => {
    // GIVEN: an array
    const originalArray: number[] = Array.from(
      { length: 5 },
      (_, idx) => idx + 1,
    );
    const copyOriginal = [...originalArray];

    // WHEN: the array is shuffled
    const shuffledArray = random.fisherYatesShuffle<number>(originalArray);

    // THEN: the original array should be the same
    expect(originalArray).toEqual(copyOriginal);
  });

  it("returns an array with the same elements", () => {
    // GIVEN: an array
    const originalArray: number[] = Array.from(
      { length: 5 },
      (_, idx) => idx + 1,
    );

    // WHEN: the array is shuffled
    const shuffledArray = random.fisherYatesShuffle<number>(originalArray);

    // THEN: the result should contain the same elements as the original array
    expect(shuffledArray.sort((a, b) => a - b)).toEqual(originalArray);
  });

  it("returns an array which its elements' order should be potentially different", () => {
    // GIVEN: an array
    const originalArray: number[] = Array.from(
      { length: 5 },
      (_, idx) => idx + 1,
    );

    let hasDifferentOrder = false;
    for (let i = 0; i < 1e3; ++i) {
      // WHEN: the array is shuffled
      const shuffledArray = random.fisherYatesShuffle<number>(originalArray);

      // THEN: the order of elements should be potentially different than the original
      hasDifferentOrder = !shuffledArray.every(
        (v, idx) => v === originalArray[idx],
      );
      if (hasDifferentOrder) {
        expect(hasDifferentOrder).toBe(true);
        break;
      }
    }
  });
});

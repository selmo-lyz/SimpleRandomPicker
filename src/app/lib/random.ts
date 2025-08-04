const secureGetRandomValues = crypto.getRandomValues.bind(crypto)

export function getRandomValue(
  min: Readonly<number>,
  max: Readonly<number>
): number {
  const range = max - min + 1;
  const randArray = new Uint32Array(1);
  const size = 0x100000000;
  const maximum = 0xffffffff;
  const clipMaximum = maximum - (size % range);

  let randomValue: number;
  do {
    secureGetRandomValues(randArray);
    randomValue = randArray[0]!;
  } while (randomValue > clipMaximum);
  randomValue = min + (randomValue % range);
  return randomValue;
}

export function fisherYatesShuffle<T>(arr: ReadonlyArray<T>): T[] {
  const shuffledArr: T[] = [...arr]
  for (let i = shuffledArr.length - 1; i > 0; --i) {
    let j = getRandomValue(0, i);
    [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
  }
  return shuffledArr;
}

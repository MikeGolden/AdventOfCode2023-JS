import memoizee from "memoizee";

type LabelToFocalLengthMap = Map<string, number>;
type BoxToLabelToFocalLengthMap = Map<number, LabelToFocalLengthMap>;

const getHash = memoizee(
  (string: string): number => {
    let currentValue = 0;
    for (const char of [...string]) {
      const ascii = char.charCodeAt(0);
      currentValue += ascii;
      currentValue *= 17;
      currentValue %= 256;
    }
    return currentValue;
  },
  { primitive: true },
);

export const getPartOneSolution = (input: string): string => {
  const strings = input.trim().split(",");

  let sum = 0;
  for (const string of strings) {
    sum += getHash(string);
  }

  return sum.toString();
};

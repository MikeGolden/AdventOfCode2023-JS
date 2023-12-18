import fs from "fs";
import memoizee from "memoizee";
const getHash = memoizee(
  (string) => {
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
export const getPartOneSolution = (input) => {
  const strings = input.trim().split(",");
  let sum = 0;
  for (const string of strings) {
    sum += getHash(string);
  }
  return sum.toString();
};

export const myPart1 = fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(`Result for part 1: ${getPartOneSolution(data)}`);
});

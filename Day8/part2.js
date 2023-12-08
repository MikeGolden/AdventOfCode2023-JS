import fs from "fs";

const INSTRUCTION_REGEX =
  /(?<ORIGIN>[A-Z]{3}) = \((?<LEFT>[A-Z]{3}), (?<RIGHT>[A-Z]{3})\)/;
const getGreatestCommonDenominator = (n, m) => {
  while (m !== 0) {
    const temp = m;
    m = n % m;
    n = temp;
  }
  return n;
};
const getLeastCommonMultiple = (n, m) => {
  return (n * m) / getGreatestCommonDenominator(n, m);
};
const getLeastCommonMultipleForArray = (numbers) => {
  if (numbers.length === 2) {
    return getLeastCommonMultiple(numbers[0], numbers[1]);
  } else {
    const first = numbers.shift();
    return getLeastCommonMultiple(
      first,
      getLeastCommonMultipleForArray(numbers),
    );
  }
};
const getElementsMap = (lines) => {
  const elementsMap = new Map();
  for (let i = 1; i < lines.length; i++) {
    const match = lines[i].match(INSTRUCTION_REGEX);
    const origin = match?.groups?.["ORIGIN"] ?? "";
    const left = match?.groups?.["LEFT"] ?? "";
    const right = match?.groups?.["RIGHT"] ?? "";
    elementsMap.set(origin, { left, right });
  }
  return elementsMap;
};
export const getPartTwoSolution = (input) => {
  const lines = input.split("\n").filter(Boolean);
  const directions = [...lines[0]];
  const elementsMap = getElementsMap(lines);
  const startingPoints = [...elementsMap.keys()].filter((k) => k.endsWith("A"));
  const paths = new Map(startingPoints.map((c) => [c, []]));
  let step = 0;
  for (const startingPoint of startingPoints) {
    let path = startingPoint;
    while (!path.endsWith("Z")) {
      const direction = directions[step++ % directions.length];
      const { left, right } = elementsMap.get(path);
      path = direction === "R" ? right : left;
      paths.get(startingPoint)?.push(path);
    }
  }
  const pathLengths = [...paths.values()].map((path) => path.length);
  return getLeastCommonMultipleForArray(pathLengths).toString();
};

const myPart2 = fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(`The result for part 2: ${getPartTwoSolution(data)}`);
});

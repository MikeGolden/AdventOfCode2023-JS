type Elements = {
  left: string;
  right: string;
};

const INSTRUCTION_REGEX =
  /(?<ORIGIN>[A-Z]{3}) = \((?<LEFT>[A-Z]{3}), (?<RIGHT>[A-Z]{3})\)/;

const getGreatestCommonDenominator = (n: number, m: number): number => {
  while (m !== 0) {
    const temp = m;
    m = n % m;
    n = temp;
  }

  return n;
};

const getLeastCommonMultiple = (n: number, m: number): number => {
  return (n * m) / getGreatestCommonDenominator(n, m);
};

const getLeastCommonMultipleForArray = (numbers: number[]): number => {
  if (numbers.length === 2) {
    return getLeastCommonMultiple(numbers[0], numbers[1]);
  } else {
    const first = numbers.shift()!;
    return getLeastCommonMultiple(
      first,
      getLeastCommonMultipleForArray(numbers),
    );
  }
};

const getElementsMap = (lines: string[]): Map<string, Elements> => {
  const elementsMap = new Map<string, Elements>();
  for (let i = 1; i < lines.length; i++) {
    const match = lines[i].match(INSTRUCTION_REGEX);
    const origin = match?.groups?.["ORIGIN"] ?? "";
    const left = match?.groups?.["LEFT"] ?? "";
    const right = match?.groups?.["RIGHT"] ?? "";
    elementsMap.set(origin, { left, right });
  }

  return elementsMap;
};

export const getPartTwoSolution = (input: string): string => {
  const lines = input.split("\n").filter(Boolean);

  const directions = [...lines[0]];
  const elementsMap = getElementsMap(lines);

  const startingPoints = [...elementsMap.keys()].filter((k) => k.endsWith("A"));
  const paths = new Map<string, string[]>(startingPoints.map((c) => [c, []]));

  let step = 0;
  for (const startingPoint of startingPoints) {
    let path = startingPoint;
    while (!path.endsWith("Z")) {
      const direction = directions[step++ % directions.length];
      const { left, right } = elementsMap.get(path)!;
      path = direction === "R" ? right : left;
      paths.get(startingPoint)?.push(path);
    }
  }

  const pathLengths = [...paths.values()].map((path) => path.length);
  return getLeastCommonMultipleForArray(pathLengths).toString();
};

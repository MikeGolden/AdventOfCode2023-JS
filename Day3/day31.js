import fs from "fs";

const sumArray = (arr) => arr.reduce((acc, a) => acc + a, 0);
const getEngineSymbols = (lines) => {
  const engineSymbols = new Map();
  lines.forEach((line, lineNum) => {
    for (let i = 0; i < line.length; i++) {
      const symbol = line[i];
      if (symbol !== "." && !Number.isInteger(parseInt(symbol, 10))) {
        if (!engineSymbols.has(symbol)) {
          engineSymbols.set(symbol, []);
        }
        engineSymbols.get(symbol)?.push({
          location: { row: lineNum, column: i },
          neighboringParts: [],
        });
      }
    }
  });
  lines.forEach((line, lineNum) => {
    const engineNumbers = [...line.matchAll(/\d+/g)].map((match) => ({
      value: match[0],
      valueAsNumber: parseInt(match[0], 10),
      location: { row: lineNum, column: match.index },
    }));
    for (const engineNumber of engineNumbers) {
      engineSymbols.forEach((symbolData) => {
        symbolData.forEach((symbol) => {
          if (
            Math.abs(symbol.location.row - lineNum) <= 1 &&
            symbol.location.column >= engineNumber.location.column - 1 &&
            symbol.location.column <=
              engineNumber.location.column + engineNumber.value.length
          ) {
            symbol.neighboringParts.push(engineNumber);
          }
        });
      });
    }
  });
  return engineSymbols;
};
export const getPartOneSolution = (input) => {
  const lines = input.split("\n").filter(Boolean);
  const engineSymbols = getEngineSymbols(lines);
  const partNumberValues = [];
  engineSymbols.forEach((symbolData) => {
    symbolData.forEach((symbol) => {
      symbol.neighboringParts.forEach(({ value }) => {
        partNumberValues.push(parseInt(value, 10));
      });
    });
  });
  return sumArray(partNumberValues).toString();
};
export const getPartTwoSolution = (input) => {
  const lines = input.split("\n").filter(Boolean);
  const engineSymbols = getEngineSymbols(lines);
  const gears = engineSymbols
    .get("*")
    ?.filter(({ neighboringParts }) => neighboringParts.length === 2)
    .map(
      ({ neighboringParts }) =>
        neighboringParts[0].valueAsNumber * neighboringParts[1].valueAsNumber,
    );
  return sumArray(gears).toString();
};

const myFile = fs.readFile("input.txt", "utf-8", (err, data) => {
  if (err) throw err;
  console.log(`Result part 2: ${getPartTwoSolution(data)}`);
});

import fs from "fs";
const getValueHistories = (input) => {
  const lines = input.split("\n").filter(Boolean);
  return lines.map((line) =>
    line
      .trim()
      .split(" ")
      .map((d) => parseInt(d.trim(), 10)),
  );
};
const getDifferences = (valueHistory) => {
  const differences = [[...valueHistory]];
  while (differences.at(-1)?.some((d) => d !== 0)) {
    const nextRow = [];
    const currentRow = differences.at(-1);
    for (let i = 0; i < currentRow.length - 1; i++) {
      nextRow.push(currentRow[i + 1] - currentRow[i]);
    }
    differences.push(nextRow);
  }
  return differences;
};
export const getPartTwoSolution = (input) => {
  const valueHistories = getValueHistories(input);
  let sum = 0;
  for (const valueHistory of valueHistories) {
    const differences = getDifferences(valueHistory);
    // Last row has all 0s, insert another.
    differences.at(-1)?.unshift(0);
    // Value to insert to the remaining rows is the difference between the
    // first items from its row and the one below it.
    for (let i = 2; i <= differences.length; i++) {
      const startThisRow = differences.at(0 - i).at(0);
      const startBelowRow = differences.at(1 - i).at(0);
      differences.at(0 - i)?.unshift(startThisRow - startBelowRow);
    }
    sum += differences.at(0).at(0);
  }
  return sum.toString();
};

const myResult2 = fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(`Part 2 result: ${getPartTwoSolution(data)}`);
});

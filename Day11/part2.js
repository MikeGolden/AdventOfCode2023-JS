import fs from "fs";
const sumArray = (arr) => arr.reduce((acc, a) => acc + a, 0);
const getStarCoordinates = (universe) => {
  const coordinates = [];
  for (let row = 0; row < universe.length; row++) {
    for (let column = 0; column < universe[row].length; column++) {
      if (universe[row][column] === "#") {
        coordinates.push({ row, column });
      }
    }
  }
  return coordinates;
};
const getShortestPathLengthsOfStarPairs = (
  universe,
  starCoordinates,
  multiplier,
) => {
  const emptyRows = [];
  const emptyCols = [];
  for (let r = 0; r < universe.length; r++) {
    if (universe[r].every((x) => x === ".")) {
      emptyRows.push(r);
    }
  }
  for (let c = 0; c < universe[0].length; c++) {
    let isColumnEmpty = true;
    for (let r = 0; isColumnEmpty && r < universe.length; r++) {
      if (universe[r][c] !== ".") {
        isColumnEmpty = false;
      }
    }
    if (isColumnEmpty) {
      emptyCols.push(c);
    }
  }
  const pathLengths = [];
  const known = new Map();
  for (let i = 0; i < starCoordinates.length; i++) {
    for (let j = 0; j < starCoordinates.length; j++) {
      if (i === j) {
        continue;
      }
      if (
        known.get(i)?.get(j) !== undefined ||
        known.get(j)?.get(i) !== undefined
      ) {
        continue;
      }
      if (!known.get(i)) {
        known.set(i, new Map());
      }
      const minRow = Math.min(starCoordinates[i].row, starCoordinates[j].row);
      const minCol = Math.min(
        starCoordinates[i].column,
        starCoordinates[j].column,
      );
      const maxRow = Math.max(starCoordinates[i].row, starCoordinates[j].row);
      const maxCol = Math.max(
        starCoordinates[i].column,
        starCoordinates[j].column,
      );
      const numEmptyRowsBetweenStars = emptyRows.filter(
        (n) => n > minRow && n < maxRow,
      ).length;
      const numEmptyColsBetweenStars = emptyCols.filter(
        (n) => n > minCol && n < maxCol,
      ).length;
      const distance =
        (multiplier - 1) *
          (numEmptyRowsBetweenStars + numEmptyColsBetweenStars) +
        Math.abs(starCoordinates[i].row - starCoordinates[j].row) +
        Math.abs(starCoordinates[i].column - starCoordinates[j].column);
      known.get(i)?.set(j, distance);
      pathLengths.push(distance);
    }
  }
  return pathLengths;
};
const getSolution = (input, multiplier) => {
  const lines = input.split("\n").filter(Boolean);
  const universe = lines.map((line) => [...line]);
  const starCoordinates = getStarCoordinates(universe);
  const shortestPathLengthsOfStarPairs = getShortestPathLengthsOfStarPairs(
    universe,
    starCoordinates,
    multiplier,
  );
  return sumArray(shortestPathLengthsOfStarPairs).toString();
};

export const myPart1 = fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(`Part1 result: ${getSolution(data, 1_000_000)}`);
});

import fs from "fs";

const areCoordinatesEqual = (a, b) => {
  return a.row === b.row && a.column === b.column;
};
const pipeConnections = {
  "|": [
    { row: -1, column: 0 },
    { row: 1, column: 0 },
  ],
  "-": [
    { row: 0, column: -1 },
    { row: 0, column: 1 },
  ],
  L: [
    { row: -1, column: 0 },
    { row: 0, column: 1 },
  ],
  J: [
    { row: -1, column: 0 },
    { row: 0, column: -1 },
  ],
  7: [
    { row: 0, column: -1 },
    { row: 1, column: 0 },
  ],
  F: [
    { row: 0, column: 1 },
    { row: 1, column: 0 },
  ],
  ".": [],
  S: [
    { row: 0, column: -1 },
    { row: 0, column: 1 },
  ],
};
const getTilesAndStartLocation = (input) => {
  const lines = input.split("\n").filter(Boolean);
  let start = undefined;
  const tiles = lines.map((line, row) => {
    const lineArr = [...line];
    const tileArr = lineArr.map((c) => ({
      value: c,
      isPartOfPipeLoop: undefined,
    }));
    if (!start) {
      const indexOfS = lineArr.indexOf("S");
      if (indexOfS >= 0) {
        start = { row, column: indexOfS };
      }
    }
    return tileArr;
  });
  if (!start) {
    throw new Error("Start coordinate not fouind.");
  }
  return { tiles, start };
};
const getLoop = (start, tiles) => {
  let previous = start;
  let current = start;
  let iterate = true;
  const loop = [start];
  while (iterate) {
    const { row, column } = current;
    const currentTile = tiles[row][column];
    if (currentTile.value === "S" && loop.length > 1) {
      // We've closed the loop.
      iterate = false;
      continue;
    }
    const [option1, option2] = pipeConnections[currentTile.value].map(
      (connection) => ({
        row: row + connection.row,
        column: column + connection.column,
      }),
    );
    const tileToAdd = areCoordinatesEqual(previous, option1)
      ? option2
      : option1;
    loop.push(tileToAdd);
    tiles[tileToAdd.row][tileToAdd.column].isPartOfPipeLoop = true;
    previous = current;
    current = loop.at(-1);
  }
  return loop;
};
export const getPartOneSolution = (input) => {
  const { tiles, start } = getTilesAndStartLocation(input);
  const loop = getLoop(start, tiles);
  return Math.floor(loop.length / 2).toString();
};

export const myPart1 = fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(`Result for part 1: ${getPartOneSolution(data)}`);
});

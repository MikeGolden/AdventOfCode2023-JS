import fs from "fs";
const getCoordinateKey = (c) => {
  return [c.row, c.column].join(",");
};
const iterativeFloodFill = (row, column, arr) => {
  const queue = [{ row, column }];
  while (queue.length) {
    const { row: r, column: c } = queue.pop();
    arr[r][c] = "#";
    if (arr[r + 1]?.[c] === ".") {
      queue.push({ row: r + 1, column: c });
    }
    if (arr[r - 1]?.[c] === ".") {
      queue.push({ row: r - 1, column: c });
    }
    if (arr[r]?.[c + 1] === ".") {
      queue.push({ row: r, column: c + 1 });
    }
    if (arr[r]?.[c - 1] === ".") {
      queue.push({ row: r, column: c - 1 });
    }
  }
};
export const getPartOneSolution = (input) => {
  const lines = input.split("\n").filter(Boolean);
  const plans = lines.map((line) => {
    const [dir, dist, hex] = line.split(" ");
    const direction = dir;
    const distance = parseInt(dist, 10);
    return { direction, distance, hex };
  });
  const trench = new Map();
  const current = { row: 0, column: 0 };
  let minRow = Number.MAX_SAFE_INTEGER;
  let minCol = Number.MAX_SAFE_INTEGER;
  let maxRow = Number.MAX_SAFE_INTEGER;
  let maxCol = Number.MAX_SAFE_INTEGER;
  trench.set(getCoordinateKey(current), "#");
  const adjustCurrentFns = {
    R: () => current.column++,
    L: () => current.column--,
    U: () => current.row--,
    D: () => current.row++,
  };
  for (const plan of plans) {
    for (let i = 0; i < plan.distance; i++) {
      adjustCurrentFns[plan.direction]();
      minRow = Math.min(minRow, current.row);
      minCol = Math.min(minCol, current.column);
      maxRow = Math.max(maxRow, current.row);
      maxCol = Math.max(maxCol, current.column);
      trench.set(getCoordinateKey(current), "#");
    }
  }
  const trenchArray = Array.from({ length: maxRow - minRow + 1 }, (_, row) =>
    Array.from({ length: maxCol - minCol + 1 }, (_, col) => {
      return trench.has(
        getCoordinateKey({ row: row + minRow, column: col + minCol }),
      )
        ? "#"
        : ".";
    }),
  );
  iterativeFloodFill(75, 4, trenchArray);
  let count = 0;
  for (let r = 0; r < trenchArray.length; r++) {
    for (let c = 0; c < trenchArray[r].length; c++) {
      if (trenchArray[r][c] === "#") {
        count++;
      }
    }
  }
  return count.toString();
};

export const myPart1 = fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(`Part 1 result: ${getPartOneSolution(data)}`);
});

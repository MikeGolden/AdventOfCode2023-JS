type Coordinate = { row: number; column: number };
type Direction = "north" | "south" | "east" | "west";

const sumArray = (arr: number[]) => arr.reduce((acc, a) => acc + a, 0);

const dijkstra = (digits: number[][]) => {
  const rows = digits.length;
  const columns = digits[0].length;

  const distances: nubmer[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => Number.MAX_SAFE_INTEGER),
  );
  const backTrack: (
    | { coordinate: Coordinate; fromDirection: Direction }
    | undefined
  )[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => undefined),
  );
  const visited: boolean[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => false),
  );

  distances[0][0] = 0;
  const current: Coordinate = { row: 0, column: 0 };
  let finished = false;
  while (!finished) {
    const { row: r, column: c } = current;
    // Try move south
    if (r < rows - 1) {
      if (
        !visited[r + 1][c] &&
        distances[r + 1][c] > digits[r + 1][c] + distances[r][c]
      ) {
        let backTracker = backTrack[r][c];
        let runLength = 0;
        while (backTracker?.fromDirection === "south") {
          runLength++;
          backTracker =
            backTrack[backTracker.coordinate.row][
              backTracker.coordinate.column
            ];
        }

        if (runLength <= 3) {
          distances[r + 1][c] = digits[r + 1][c] + distances[r][c];

          if (backTrack[r + 1][c]) {
            debugger;
          }

          backTrack[r + 1][c] = {
            coordinate: { row: r, column: c },
            fromDirection: "south",
          };
        }
      }
    }

    // Try move north
    if (r > 0) {
      if (
        !visited[r - 1][c] &&
        distances[r - 1][c] > digits[r - 1][c] + distances[r][c]
      ) {
        let backTracker = backTrack[r][c];
        let runLength = 0;
        while (backTracker?.fromDirection === "north") {
          runLength++;
          backTracker =
            backTrack[backTracker.coordinate.row][
              backTracker.coordinate.column
            ];
        }

        if (runLength <= 3) {
          distances[r - 1][c] = digits[r - 1][c] + distances[r][c];

          if (backTrack[r - 1][c]) {
            debugger;
          }

          backTrack[r - 1][c] = {
            coordinate: { row: r, column: c },
            fromDirection: "north",
          };
        }
      }
    }

    // Try move east
    if (c < columns - 1) {
      if (
        !visited[r][c + 1] &&
        distances[r][c + 1] > digits[r][c + 1] + distances[r][c]
      ) {
        let backTracker = backTrack[r][c];
        let runLength = 0;
        while (backTracker?.fromDirection === "east") {
          runLength++;
          backTracker =
            backTrack[backTracker.coordinate.row][
              backTracker.coordinate.column
            ];
        }

        if (runLength <= 3) {
          distances[r][c + 1] = digits[r][c + 1] + distances[r][c];

          if (backTrack[r][c + 1]) {
            debugger;
          }

          backTrack[r][c + 1] = {
            coordinate: { row: r, column: c },
            fromDirection: "east",
          };
        }
      }
    }

    // Try move west
    if (c > 0) {
      if (
        !visited[r][c - 1] &&
        distances[r][c - 1] > digits[r][c - 1] + distances[r][c]
      ) {
        let backTracker = backTrack[r][c];
        let runLength = 0;
        while (backTracker?.fromDirection === "west") {
          runLength++;
          backTracker =
            backTrack[backTracker.coordinate.row][
              backTracker.coordinate.column
            ];
        }

        if (runLength <= 3) {
          distances[r][c - 1] = digits[r][c - 1] + distances[r][c];

          if (backTrack[r][c - 1]) {
            debugger;
          }

          backTrack[r][c - 1] = {
            coordinate: { row: r, column: c },
            fromDirection: "west",
          };
        }
      }
    }

    visited[r][c] = true;

    let minCoordinate: Coordinate = { row: 0, column: 0 };
    let minDistance = Number.MAX_SAFE_INTEGER;
    for (let rDist = 0; rDist < rows; rDist++) {
      for (let cDist = 0; cDist < columns; cDist++) {
        if (visited[rDist][cDist]) {
          continue;
        }

        const distance = distances[rDist][cDist];
        if (distance < minDistance) {
          minDistance = distance;
          minCoordinate = { row: rDist, column: cDist };
        }
      }
    }

    current.row = minCoordinate.row;
    current.column = minCoordinate.column;

    if (current.row === rows - 1 && current.column === columns - 1) {
      finished = true;
      break;
    }
  }

  const path: Coordinate[] = [];
  let u: Coordinate | undefined = { row: rows - 1, column: columns - 1 };
  while (u) {
    path.unshift(u);
    u = backTrack[u.row][u.column]?.coordinate;
  }

  return path;
};

export const getPartOneSolution = (input: string): string => {
  const lines = input.split("\n").filter(Boolean);
  const digits = lines.map<number[]>((line) =>
    [...line].map((d) => parseInt(d, 10)),
  );
  const path = dijkstra(digits);
  console.log(path.map(({ row, column }) => [row, column].join()).join("|"));
  const weights = path.map(({ row, column }) => digits[row][column]);
  const grid: string[][] = Array.from({ length: digits.length }, (_, r) =>
    Array.from({ length: digits[0].length }, (_, c) => digits[r][c].toString()),
  );
  for (const coordinate of path) {
    grid[coordinate.row][coordinate.column] = "#";
  }
  console.log(grid.map((l) => l.join("")).join("\n"));
  return sumArray(weights).toString();
};

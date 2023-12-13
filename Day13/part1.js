import fs from "fs";
class Pattern {
  constructor(lines) {
    this.smudge = (row, column) => {
      const adjustedValues = this._values.map((line) => [...line]);
      adjustedValues[row][column] =
        adjustedValues[row][column] === "#" ? "." : "#";
      return new Pattern(adjustedValues);
    };
    this.getColsLeftOfVerticalLineOfReflection = (
      options = { disallowed: -1 },
    ) => {
      const { disallowed } = options;
      for (let c = 0; c < this._columns - 1; c++) {
        if (this._doColumnsMatch(c, c + 1)) {
          if (c === disallowed) {
            continue;
          }
          if (this._isVerticallyMirroredAt(c)) {
            return c + 1;
          }
        }
      }
      return 0;
    };
    this.getRowsAboveHorizontalLineOfReflection = (
      options = { disallowed: -1 },
    ) => {
      const { disallowed } = options;
      for (let r = 0; r < this._rows - 1; r++) {
        if (this._doRowsMatch(r, r + 1)) {
          if (r === disallowed) {
            continue;
          }
          if (this._isHorizontallyMirroredAt(r)) {
            return r + 1;
          }
        }
      }
      return 0;
    };
    this._doColumnsMatch = (c1, c2) => {
      return this._values.every((row) => row[c1] === row[c2]);
    };
    this._doRowsMatch = (r1, r2) => {
      for (let c = 0; c < this._columns; c++) {
        if (this._values[r1][c] !== this._values[r2][c]) {
          return false;
        }
      }
      return true;
    };
    this._isVerticallyMirroredAt = (column) => {
      for (let c = 1; c < this._columns; c++) {
        for (let r = 0; r < this._rows; r++) {
          if (column - c < 0 || c + column >= this._columns) {
            // We've fallen off the edge.
            // Every other column has a reflected column within the pattern and must match exactly.
            return true;
          }
          if (this._values[r][column - c] !== this._values[r][c + column + 1]) {
            return false;
          }
        }
      }
      return true;
    };
    this._isHorizontallyMirroredAt = (row) => {
      for (let r = 1; r <= this._rows; r++) {
        for (let c = 0; c < this._columns; c++) {
          if (row - r < 0 || row + r + 1 >= this._rows) {
            // We've fallen off the edge.
            // Every other row has a reflected row within the pattern and must match exactly.
            return true;
          }
          if (this._values[row - r][c] !== this._values[row + r + 1][c]) {
            return false;
          }
        }
      }
      return true;
    };
    this._values = lines;
    this._rows = lines.length;
    this._columns = lines[0].length;
  }
  get rows() {
    return this._rows;
  }
  get columns() {
    return this._columns;
  }
}
const getPatterns = (input) => {
  const patterns = [[]];
  const lines = input.trim().split("\n");
  for (const line of lines) {
    if (line) {
      patterns.at(-1)?.push([...line]);
    } else {
      patterns.push([]);
    }
  }
  return patterns.map((p) => new Pattern(p));
};
export const getPartOneSolution = (input) => {
  const patterns = getPatterns(input);
  let totalColsLeftOfVerticalLineOfReflection = 0;
  let totalRowsAboveHorizontalLineOfReflection = 0;
  for (const pattern of patterns) {
    totalColsLeftOfVerticalLineOfReflection +=
      pattern.getColsLeftOfVerticalLineOfReflection();
    totalRowsAboveHorizontalLineOfReflection +=
      pattern.getRowsAboveHorizontalLineOfReflection();
  }
  return (
    totalColsLeftOfVerticalLineOfReflection +
    100 * totalRowsAboveHorizontalLineOfReflection
  ).toString();
};

export const myPart1 = fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(`Result for part 1: ${getPartOneSolution(data)}`);
});

class Pattern {
  private _values: ReadonlyArray<ReadonlyArray<string>>;
  private readonly _rows: number;
  private readonly _columns: number;

  constructor(lines: string[][]) {
    this._values = lines;
    this._rows = lines.length;
    this._columns = lines[0].length;
  }

  get rows(): number {
    return this._rows;
  }

  get columns(): number {
    return this._columns;
  }

  smudge = (row: number, column: number): Pattern => {
    const adjustedValues = this._values.map((line) => [...line]);
    adjustedValues[row][column] =
      adjustedValues[row][column] === "#" ? "." : "#";
    return new Pattern(adjustedValues);
  };

  getColsLeftOfVerticalLineOfReflection = (
    options: { disallowed: number } = { disallowed: -1 },
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

  getRowsAboveHorizontalLineOfReflection = (
    options: { disallowed: number } = { disallowed: -1 },
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

  private _doColumnsMatch = (c1: number, c2: number): boolean => {
    return this._values.every((row) => row[c1] === row[c2]);
  };

  private _doRowsMatch = (r1: number, r2: number): boolean => {
    for (let c = 0; c < this._columns; c++) {
      if (this._values[r1][c] !== this._values[r2][c]) {
        return false;
      }
    }

    return true;
  };

  private _isVerticallyMirroredAt = (column: number): boolean => {
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

  private _isHorizontallyMirroredAt = (row: number): boolean => {
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
}

const getPatterns = (input: string): Array<Pattern> => {
  const patterns: Array<Array<Array<string>>> = [[]];
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

export const getPartTwoSolution = (input: string): string => {
  const patterns = getPatterns(input);

  let totalColsLeft = 0;
  let totalRowsAbove = 0;
  for (const pattern of patterns) {
    const v1 = pattern.getColsLeftOfVerticalLineOfReflection();
    const h1 = pattern.getRowsAboveHorizontalLineOfReflection();

    (function adjustAndResummarize() {
      for (let r = 0; r < pattern.rows; r++) {
        for (let c = 0; c < pattern.columns; c++) {
          const adjustedPattern = pattern.smudge(r, c);

          const v2 = adjustedPattern.getColsLeftOfVerticalLineOfReflection({
            disallowed: v1 - 1,
          });
          if (v2 && v1 !== v2) {
            totalColsLeft += v2;
            return;
          }

          const h2 = adjustedPattern.getRowsAboveHorizontalLineOfReflection({
            disallowed: h1 - 1,
          });
          if (h2 && h1 !== h2) {
            totalRowsAbove += h2;
            return;
          }
        }
      }
    })();
  }

  return (totalColsLeft + 100 * totalRowsAbove).toString();
};

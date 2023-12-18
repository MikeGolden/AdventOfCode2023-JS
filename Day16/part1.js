import memoizee from "memoizee";
import fs from "fs";
const splitLines = memoizee(
  (input, options) => {
    const { retainEmptyLines } = options;
    const lines = input.trim().split("\n");
    return retainEmptyLines ? lines : lines.filter(Boolean);
  },
  { primitive: true },
);
const inputTo2dArray = (
  input,
  mapper,
  options = { retainEmptyLines: false },
) => {
  const lines = splitLines(input, options);
  return lines.map((line, row) =>
    [...line].map((character, column) => mapper(character, row, column)),
  );
};
class Beam {
  constructor(coordinate, direction) {
    this.clone = () => new Beam({ ...this._coordinate }, this._direction);
    this.goNorth = () => {
      this._coordinate.row--;
      this._direction = "north";
      return this;
    };
    this.goSouth = () => {
      this._coordinate.row++;
      this._direction = "south";
      return this;
    };
    this.goEast = () => {
      this._coordinate.column++;
      this._direction = "east";
      return this;
    };
    this.goWest = () => {
      this._coordinate.column--;
      this._direction = "west";
      return this;
    };
    this._coordinate = coordinate;
    this._direction = direction;
  }
  get coordinate() {
    return this._coordinate;
  }
  get direction() {
    return this._direction;
  }
}
const stepBeam = (space, beam) => {
  const { direction } = beam;
  switch (space.value) {
    case ".": {
      switch (direction) {
        case "north":
          return beam.goNorth();
        case "south":
          return beam.goSouth();
        case "east":
          return beam.goEast();
        case "west":
          return beam.goWest();
      }
      break;
    }
    case "/": {
      switch (direction) {
        case "north":
          return beam.goEast();
        case "south":
          return beam.goWest();
        case "east":
          return beam.goNorth();
        case "west":
          return beam.goSouth();
      }
      break;
    }
    case "\\": {
      switch (direction) {
        case "north":
          return beam.goWest();
        case "south":
          return beam.goEast();
        case "east":
          return beam.goSouth();
        case "west":
          return beam.goNorth();
      }
      break;
    }
    case "|": {
      switch (direction) {
        case "north":
          return beam.goNorth();
        case "south":
          return beam.goSouth();
        case "east":
        case "west": {
          const newBeam = beam.clone();
          beam.goNorth();
          return newBeam.goSouth();
        }
      }
      break;
    }
    case "-": {
      switch (direction) {
        case "north":
        case "south": {
          const newBeam = beam.clone();
          beam.goWest();
          return newBeam.goEast();
        }
        case "east":
          return beam.goEast();
        case "west":
          return beam.goWest();
      }
      break;
    }
  }
};
const getInitialSpaces = (input) =>
  inputTo2dArray(input, (character, row, column) => ({
    value: character,
    coordinate: { row, column },
    isEnergized: false,
    previousBeamDirections: new Set(),
  }));
const stepBeams = (spaces, beams) => {
  let beamCounter = beams.size;
  while (true) {
    let areBeamsStepping = false;
    for (const [beamNum, beam] of beams.entries()) {
      const { coordinate, direction } = beam;
      const { row, column } = coordinate;
      if (
        row < 0 ||
        row >= spaces.length ||
        column < 0 ||
        column >= spaces[0].length
      ) {
        // Beam fell off the edge and isn't coming back. Stop tracking it.
        beams.delete(beamNum);
        continue;
      }
      const space = spaces[row][column];
      if (space.previousBeamDirections.has(direction)) {
        // A beam going this direction has already been in this space!
        // There's no need to keep it around since it will follow the
        // the same path of the previous beam.
        beams.delete(beamNum);
        continue;
      }
      areBeamsStepping = true;
      space.isEnergized = true;
      space.previousBeamDirections.add(direction);
      const newBeam = stepBeam(space, beam);
      if (newBeam) {
        beams.set(++beamCounter, newBeam);
      }
    }
    if (!areBeamsStepping) {
      break;
    }
  }
};
export const getPartOneSolution = (input) => {
  const spaces = getInitialSpaces(input);
  const beams = new Map([[0, new Beam({ row: 0, column: 0 }, "east")]]);
  stepBeams(spaces, beams);
  let count = 0;
  for (let r = 0; r < spaces.length; r++) {
    for (let c = 0; c < spaces[r].length; c++) {
      if (spaces[r][c].isEnergized) {
        count++;
      }
    }
  }
  return count.toString();
};

export const myPart1 = fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(`Result for part 1: ${getPartOneSolution(data)}`);
});

import fs from "fs";

const mapTypes = [
  "seed-to-soil",
  "soil-to-fertilizer",
  "fertilizer-to-water",
  "water-to-light",
  "light-to-temperature",
  "temperature-to-humidity",
  "humidity-to-location",
];
export const getPartOneSolution = (input) => {
  const lines = input.split("\n");
  let seeds = [];
  const maps = [];
  for (const line of lines) {
    if (!line.trim()) {
      maps.push([]);
      break;
    }
    if (line.startsWith("seeds:")) {
      seeds = line
        .split(":")[1]
        .trim()
        .split(" ")
        .filter(Boolean)
        .map((d) => parseInt(d, 10));
      break;
    }
    if (mapTypes.some((mapType) => line.startsWith(mapType))) {
      break;
    }
    const [destinationRangeStart, sourceRangeStart, rangeLength] = line
      .split(" ")
      .filter(Boolean)
      .map((d) => parseInt(d, 10));
    maps.at(-1)?.push({
      destinationStart: destinationRangeStart,
      sourceStart: sourceRangeStart,
      length: rangeLength,
    });
  }
  let minLocationNumber = Number.MAX_SAFE_INTEGER;
  for (const seed of seeds) {
    let mappedVal = seed;
    for (const map of maps) {
      const data = map.find(
        (x) =>
          mappedVal >= x.sourceStart && mappedVal <= x.sourceStart + x.length,
      );
      mappedVal = data
        ? data.destinationStart + (mappedVal - data.sourceStart)
        : mappedVal;
    }
    minLocationNumber = Math.min(minLocationNumber, mappedVal);
  }
  return minLocationNumber.toString();
};
export const getPartTwoSolution = (input) => {
  const lines = input.split("\n").filter(Boolean);
  return lines.join();
};

const myFile = fs.readFile("input.txt", "utf-8", (err, data) => {
  if (err) throw err;
  console.log(`Result for the 1st part: ${getPartOneSolution(data)}`);
  console.log(`Result for the 2nd part: ${getPartTwoSolution(data)}`);
});

import fs from "fs";

const multiplyArray = (arr) => arr.reduce((acc, a) => acc * a, 1);
export const getPartOneSolution = (input) => {
  const lines = input.split("\n");
  const times = lines[0]
    .split(":")[1]
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((d) => parseInt(d, 10));
  const distances = lines[1]
    .split(":")[1]
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((d) => parseInt(d, 10));
  const races = times.map((_, i) => ({
    time: times[i],
    currentDistanceRecord: distances[i],
  }));
  const numWaysToWin = races.map((race) => {
    const winners = Array.from({ length: race.time }, (_, i) => i).filter(
      (speed) => (race.time - speed) * speed > race.currentDistanceRecord,
    );
    return winners.length;
  });
  return multiplyArray(numWaysToWin).toString();
};

const myInput = fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(`The result for Part 1: ${getPartOneSolution(data)}`);
});

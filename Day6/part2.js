import fs from "fs";

export const getPartTwoSolution = (input) => {
  const lines = input.split("\n");
  const time = parseInt(lines[0].split(":")[1].trim().replaceAll(" ", ""));
  const currentDistanceRecord = parseInt(
    lines[1].split(":")[1].trim().replaceAll(" ", ""),
  );
  const winners = Array.from({ length: time }, (_, i) => i).filter(
    (speed) => (time - speed) * speed > currentDistanceRecord,
  );
  return winners.length.toString();
};

const myFile = fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(`Result for part 2: ${getPartTwoSolution(data)}`);
});
